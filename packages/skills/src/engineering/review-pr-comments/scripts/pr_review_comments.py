#!/usr/bin/env python3

import argparse
import json
import re
import subprocess
import sys
from typing import Any


DECISION_REACTIONS = {"+1", "-1", "eyes"}
PR_URL_PATTERN = re.compile(r"/([^/]+)/([^/]+)/pull/(\d+)(?:/|$)")
QUALIFIED_PR_PATTERN = re.compile(r"^([^/]+)/([^#]+)#(\d+)$")


def run_gh(arguments: list[str], payload: dict[str, Any] | None = None) -> str:
    command = ["gh", *arguments]
    result = subprocess.run(
        command,
        input=json.dumps(payload) if payload is not None else None,
        capture_output=True,
        check=False,
        text=True,
    )
    if result.returncode != 0:
        message = result.stderr.strip() or result.stdout.strip() or "unknown gh error"
        raise RuntimeError(f"{' '.join(command)} failed: {message}")
    return result.stdout


def run_gh_json(
    arguments: list[str], payload: dict[str, Any] | None = None
) -> Any:
    output = run_gh(arguments, payload).strip()
    return json.loads(output) if output else None


def resolve_pr(selector: str, repository: str | None) -> dict[str, Any]:
    qualified_match = QUALIFIED_PR_PATTERN.fullmatch(selector)
    if qualified_match:
        owner, name, number = qualified_match.groups()
        repository = f"{owner}/{name}"
        selector = number
    elif selector.startswith("#"):
        selector = selector[1:]

    command = ["pr", "view", selector, "--json", "number,url,title,headRefOid,baseRefOid"]
    if repository:
        command.extend(["--repo", repository])
    pull_request = run_gh_json(command)

    match = PR_URL_PATTERN.search(pull_request["url"])
    if not match:
        raise RuntimeError(f"Could not parse repository from {pull_request['url']}")

    owner, name, number = match.groups()
    return {
        **pull_request,
        "owner": owner,
        "repository": name,
        "number": int(number),
        "nameWithOwner": f"{owner}/{name}",
    }


THREADS_QUERY = """
query($owner: String!, $name: String!, $number: Int!, $cursor: String) {
  repository(owner: $owner, name: $name) {
    pullRequest(number: $number) {
      reviewThreads(first: 50, after: $cursor) {
        nodes {
          id
          isResolved
          isOutdated
          path
          line
          originalLine
          comments(first: 100) {
            nodes {
              id
              databaseId
              url
              body
              createdAt
              updatedAt
              path
              line
              originalLine
              diffHunk
              author { login }
              replyTo { id databaseId }
            }
            pageInfo { hasNextPage endCursor }
          }
        }
        pageInfo { hasNextPage endCursor }
      }
    }
  }
}
"""


COMMENTS_QUERY = """
query($threadId: ID!, $cursor: String) {
  node(id: $threadId) {
    ... on PullRequestReviewThread {
      comments(first: 100, after: $cursor) {
        nodes {
          id
          databaseId
          url
          body
          createdAt
          updatedAt
          path
          line
          originalLine
          diffHunk
          author { login }
          replyTo { id databaseId }
        }
        pageInfo { hasNextPage endCursor }
      }
    }
  }
}
"""


def graphql(query: str, variables: dict[str, Any]) -> dict[str, Any]:
    result = run_gh_json(
        ["api", "graphql", "--input", "-"],
        {"query": query, "variables": variables},
    )
    if result.get("errors"):
        raise RuntimeError(f"GraphQL request failed: {json.dumps(result['errors'])}")
    return result


def fetch_remaining_comments(thread: dict[str, Any]) -> None:
    connection = thread["comments"]
    cursor = connection["pageInfo"]["endCursor"]
    while connection["pageInfo"]["hasNextPage"]:
        data = graphql(COMMENTS_QUERY, {"threadId": thread["id"], "cursor": cursor})
        page = data["data"]["node"]["comments"]
        connection["nodes"].extend(page["nodes"])
        connection["pageInfo"] = page["pageInfo"]
        cursor = page["pageInfo"]["endCursor"]


def fetch_unresolved_threads(pull_request: dict[str, Any]) -> list[dict[str, Any]]:
    variables = {
        "owner": pull_request["owner"],
        "name": pull_request["repository"],
        "number": pull_request["number"],
        "cursor": None,
    }
    threads: list[dict[str, Any]] = []

    while True:
        data = graphql(THREADS_QUERY, variables)
        connection = data["data"]["repository"]["pullRequest"]["reviewThreads"]
        for thread in connection["nodes"]:
            if not thread["isResolved"]:
                fetch_remaining_comments(thread)
                threads.append(thread)

        if not connection["pageInfo"]["hasNextPage"]:
            break
        variables["cursor"] = connection["pageInfo"]["endCursor"]

    return threads


def list_comments(arguments: argparse.Namespace) -> None:
    pull_request = resolve_pr(arguments.pr, arguments.repo)
    threads = fetch_unresolved_threads(pull_request)
    output = {
        "pullRequest": pull_request,
        "unresolvedThreadCount": len(threads),
        "commentCount": sum(len(thread["comments"]["nodes"]) for thread in threads),
        "threads": threads,
    }
    print(json.dumps(output, indent=2))


def current_login() -> str:
    return run_gh_json(["api", "user"])["login"]


def list_reactions(repository: str, comment_id: int) -> list[dict[str, Any]]:
    reactions: list[dict[str, Any]] = []
    page = 1
    while True:
        batch = run_gh_json(
            [
                "api",
                "--method",
                "GET",
                f"repos/{repository}/pulls/comments/{comment_id}/reactions",
                "-f",
                "per_page=100",
                "-f",
                f"page={page}",
            ]
        )
        reactions.extend(batch)
        if len(batch) < 100:
            return reactions
        page += 1


def set_reaction(arguments: argparse.Namespace) -> None:
    login = current_login()
    reactions = list_reactions(arguments.repo, arguments.comment_id)
    own_decisions = [
        reaction
        for reaction in reactions
        if reaction["user"]["login"] == login
        and reaction["content"] in DECISION_REACTIONS
    ]

    if (
        len(own_decisions) == 1
        and own_decisions[0]["content"] == arguments.content
    ):
        print(
            json.dumps(
                {
                    "status": "unchanged",
                    "commentId": arguments.comment_id,
                    "content": arguments.content,
                }
            )
        )
        return

    for reaction in own_decisions:
        run_gh(
            [
                "api",
                "--method",
                "DELETE",
                f"repos/{arguments.repo}/pulls/comments/"
                f"{arguments.comment_id}/reactions/{reaction['id']}",
            ]
        )

    created = run_gh_json(
        [
            "api",
            "--method",
            "POST",
            f"repos/{arguments.repo}/pulls/comments/{arguments.comment_id}/reactions",
            "-f",
            f"content={arguments.content}",
        ]
    )
    print(
        json.dumps(
            {
                "status": "updated",
                "commentId": arguments.comment_id,
                "content": created["content"],
                "reactionId": created["id"],
            }
        )
    )


def post_reply(arguments: argparse.Namespace) -> None:
    created = run_gh_json(
        [
            "api",
            "--method",
            "POST",
            f"repos/{arguments.repo}/pulls/{arguments.pr_number}/comments/"
            f"{arguments.comment_id}/replies",
            "-f",
            f"body={arguments.body}",
        ]
    )
    print(
        json.dumps(
            {
                "status": "created",
                "commentId": created["id"],
                "url": created["html_url"],
            }
        )
    )


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description=(
            "List unresolved PR review comments, manage decision reactions, "
            "and post approved replies."
        )
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    list_parser = subparsers.add_parser("list")
    list_parser.add_argument("--pr", required=True)
    list_parser.add_argument("--repo")
    list_parser.set_defaults(handler=list_comments)

    react_parser = subparsers.add_parser("react")
    react_parser.add_argument("--repo", required=True)
    react_parser.add_argument("--comment-id", required=True, type=int)
    react_parser.add_argument(
        "--content", required=True, choices=sorted(DECISION_REACTIONS)
    )
    react_parser.set_defaults(handler=set_reaction)

    reply_parser = subparsers.add_parser("reply")
    reply_parser.add_argument("--repo", required=True)
    reply_parser.add_argument("--pr-number", required=True, type=int)
    reply_parser.add_argument("--comment-id", required=True, type=int)
    reply_parser.add_argument("--body", required=True)
    reply_parser.set_defaults(handler=post_reply)

    return parser


def main() -> int:
    parser = build_parser()
    arguments = parser.parse_args()
    try:
        arguments.handler(arguments)
    except (KeyError, TypeError, ValueError, RuntimeError, json.JSONDecodeError) as error:
        print(f"error: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
