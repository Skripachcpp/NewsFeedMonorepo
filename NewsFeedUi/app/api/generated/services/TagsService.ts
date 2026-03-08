/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TagDto } from '../models/TagDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TagsService {
    /**
     * @returns TagDto
     * @throws ApiError
     */
    public static tagsGetTags(): CancelablePromise<Array<TagDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tags/tags',
        });
    }
    /**
     * @param id
     * @returns binary
     * @throws ApiError
     */
    public static tagsDeleteTag(
        id: number,
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/tags/tags/{id}',
            path: {
                'id': id,
            },
        });
    }
}
