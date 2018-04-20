// @flow

export type UserDataType = {
  value: number,
  tier: number,
};

export type UserData = {
  approvalGivenAfterTwoApprovals: UserDataType,
  approvalGivenFirst: UserDataType,
  approvalGivenSecond: UserDataType,
  approved: UserDataType,
  approvedBeforeChangeRequestGivenBySomeoneElse: UserDataType,
  changesRequestedGiven: UserDataType,
  changesRequestedReceived: UserDataType,
  approvalsReceived: UserDataType,
  commentsGiven: UserDataType,
  commentsReceived: UserDataType,
  merged: UserDataType,
  pullRequestsSubmitted: UserDataType,

  // Built at end
  totalActivity: UserDataType,
  firstTwoToApprove: UserDataType,
  changeRequestReceivedPerPR: UserDataType,
  commentsGivenPerApproval: UserDataType,
  approvedBeforeChangeRequestPerPR: UserDataType,
  commentsReceivedPerPR: UserDataType,
  approvalsReceivedPerPR: UserDataType,

  name: {
    value: string,
    tier: 0
  },
};

export type Users = {
  [key: string]: UserData
};

// export type AggregateData = {
//   maxApproval: number,
// }

export type Links = {
  [reviewer: string]: {
    [author: string]: number
  }
}

export type Nodes = ({
  // github id
  id: string,
  // real name/ what to display to ui
  label: string
})[];

export type IdentityGraphData = {
  links: Links,
  nodes: Nodes
}

export type PullRequestData = ({|
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
    |});

export type GithubReviewData = {|
  data: {|
    rateLimit?: {|
      cost: number,
      limit: number,
      remaining: number,
      resetAt: string
    |},
    repository: {|
      pullRequests: {|
      edges: PullRequestData[],
      totalCount?: number
    |}|}
  |}
|};

export type ReduxState = Object;

export type Approval = {
  changeRequestedAfterApproval?: boolean,
  existingApprovals: number,
  createdAt: string,
  login: string,
  number: number,
  state: string
};

export type Comment = {
  createdAt: string,
  isReviewComment?: boolean,
  isChangeRequestedComment?: boolean,
  isNonReviewComment?: boolean,
  login: string
};

export type RequestedChange = {
  createdAt: string,
  existingApprovals: number,
  login: string,
  number: number,
  state: string
}

export type Dates = {
  oldestFromDate: string,
  newestToDate: string,
  selectedFromDate: string,
  selectedToDate: string,
}

export type ReviewData = {
  userData: Users,
  // aggregatedData: AggregateData
}

export type SortedDates = {
  head: string,
  last: string,
}

export type PathMatch = {
  params: {
    name: string
  }
}
