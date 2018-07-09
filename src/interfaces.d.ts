
export interface FetchPostsArguments {
	offset: number;
}

export interface SelectImageArguments {
	file: File;
}

export interface MessageInputArguments {
	message: string;
}

export interface SubmitPostArguments {
	id?: string;
	message: string;
	imageUrl: string;
}

export interface FavPostArguments {
	id: string;
}

export interface RetrySubmitArguments {
	id: string;
	message: string;
	imageUrl: string;
}

export interface PostState {
	highQualityUrl: string;
	lowQualityUrl: string;
	message: string;
	imageUrl?: string;
	id: string;
	favCount: number;
	hasFailed?: boolean;
}

export interface FeedState {
	posts: PostState[];
	total: number;
}

export interface State {
	post: PostState;
	feed: FeedState;
}
