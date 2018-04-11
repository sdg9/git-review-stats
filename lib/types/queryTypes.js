// @flow

export type Reviews = {| data:
{|
  rateLimit: {|
    cost: number,
    limit: number,
    remaining: number,
    resetAt: string
  |},
  repository: {|
    pullRequests: {|
    edges: ({|
      cursor: string,
      node: {|
        additions: number,
        author: {|login: string|},
        baseRef: {|id: string, name: string|},
        changedFiles: number,
        closed: boolean,
        closedAt: string,
        comments: {|
          edges: {|node: {|
            author: {|login: string|},
            bodyText: string,
            createdAt: string
          |}|}[],
          totalCount: number
        |},
        commits: {|totalCount: number|},
        createdAt: string,
        deletions: number,
        headRef: {|id: string, name: string|},
        id: string,
        mergedAt: string,
        mergedBy: {|login: string|},
        number: number,
        reviewRequests: {|
          nodes: {|reviewer: {|login: string|}|}[],
          totalCount: number
        |},
        reviews: {|
          nodes: ({|
            author: {|login: string|},
            comments: {|
              totalCount: number,
              edges: {|node: {|
                bodyText: string,
                createdAt: string,
                author: {|
                  login: string
                |}
              |}|}[]
            |},
            createdAt: string,
            state: string
          |})[],
          totalCount: number
        |},
        suggestedReviewers: empty[],
        title: string,
        url: string
      |}
    |})[],
    totalCount: number
  |}|}
|}
|};
