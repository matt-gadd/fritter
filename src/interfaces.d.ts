
export interface FetchPostsArguments {
	offset: number;
}

export interface SelectImageArguments {
	file: File;
}

export interface CaptionInputArguments {
	caption: string;
}

export interface SubmitPostArguments {
	id?: string;
	caption: string;
	imageUrl: string;
}

export interface FavPostArguments {
	id: string;
}

export interface RetrySubmitArguments {
	id: string;
	caption: string;
	imageUrl: string;
}

export interface PostState {
	highQualityUrl: string;
	lowQualityUrl: string;
	caption: string;
	id: string;
	favCount: number;
	hasFailed?: boolean;
}

export interface NewPostState {
	id: string;
	imageUrl: string;
	caption: string;
}

export interface FeedState {
	posts: PostState[];
	total: number;
}

export interface State {
	post: NewPostState;
	feed: FeedState;
}
