
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
	high_quality_url: string;
	low_quality_url: string;
	message: string;
	imageUrl?: string;
	id: string;
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
