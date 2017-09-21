import Rx from "rxjs";

import { hashCode } from "../utils";

const PAGE_SIZE = 10;

export function fetchPosts({ userId, page } = {}) {
    return () => {
        return Rx.Observable
            .ajax(`//jsonplaceholder.typicode.com/posts?${ userId ? "userId=" + userId : ""}`)
            .pluck("response")
            .delay(100)
            .map(posts => posts
                .map(post => ({
                    ...post,
                    description: `${post.body.repeat(2).slice(0, -35)}...`, // Fake description
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
        return Rx.Observable.ajax(`//jsonplaceholder.typicode.com/posts/${postId}`)
            .pluck("response")
            .delay(100)
            .map(post => ({
                ...post,
                body: post.body.repeat(10), // Fake long post
            }));
    }
}

export function fetchComments(postId) {
    return () => {
        return Rx.Observable.ajax(`//jsonplaceholder.typicode.com/posts/${postId}/comments`)
            .pluck("response")
            .delay(100);
    }
}
