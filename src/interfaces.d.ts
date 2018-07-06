
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
	message: string;
	file: File;
}

export interface PostState {
	highQualityUrl: string;
	lowQualityUrl: string;
	message: string;
	imageUrl?: string;
	id: string;
	favCount: number;
}

export interface FeedState {
	posts: PostState[];
	total: number;
	isLoading: boolean;
}

export interface State {
	post: PostState;
	feed: FeedState;
}
