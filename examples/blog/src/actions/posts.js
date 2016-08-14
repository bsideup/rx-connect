import Rx from "rx";

import { hashCode } from "../utils";

const PAGE_SIZE = 10;

export function fetchPosts({ userId, page } = {}) {
    return () => {
        return Rx.DOM
            .getJSON(`//jsonplaceholder.typicode.com/posts?${ userId ? "userId=" + userId : ""}`)
            .delay(100)
            .map(posts => posts
                .map(post => ({
                    ...post,
                    hashCode: post.title::hashCode(),
                }))
                .sort((a, b) => a.hashCode - b.hashCode) // better posts distribution because jsonplaceholder returns them sorted by user
            )
            .map(posts => ({
                total: posts.length / PAGE_SIZE,
                data: page == undefined ? posts : posts.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE) // Simulate server-side pagination
            }));
    }
}

export function fetchPost(postId) {
    return () => {
        return Rx.DOM.getJSON(`//jsonplaceholder.typicode.com/posts/${postId}`).delay(100);
    }
}

export function fetchComments(postId) {
    return () => {
        return Rx.DOM.getJSON(`//jsonplaceholder.typicode.com/posts/${postId}/comments`).delay(100);
    }
}
