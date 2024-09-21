import { Inject, Injectable } from '@nestjs/common';
import { PaginationQueryDto } from './dtos/pagination-query.dto';
import { ObjectLiteral, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Paginated } from './interfaces/pagination.interface';

@Injectable()
export class PaginationProvider {
  constructor(
    /**
     * Injecting request
     */

    @Inject(REQUEST)
    private readonly request: Request,
  ) {}
  public async paginateQuery<T extends ObjectLiteral>(
    paginationQuery: PaginationQueryDto,
    repository: Repository<T>,
  ): Promise<Paginated<T>> {
    let results = await repository.find({
      skip: (paginationQuery?.page - 1) * paginationQuery?.limit,
      take: paginationQuery?.limit,
    });

    /**
     * Create the request URLS
     */

    const baseUrl =
      this.request.protocol + '://' + this.request.headers.host + '/';

    const newUrl = new URL(this.request.url, baseUrl);

    /**
     * Calculating the page numbers
     */
    const totalItems = await repository.count();
    const totalPages = Math.ceil(totalItems / paginationQuery?.limit);
    const nextPage =
      paginationQuery.page === totalPages
        ? paginationQuery.page
        : paginationQuery?.page + 1;
    const previousPage =
      paginationQuery.page === 1
        ? paginationQuery.page
        : paginationQuery?.page - 1;

    const finalResponse: Paginated<T> = {
      data: results,
      meta: {
        itemsPerPage: paginationQuery.limit,
        totalItems: totalItems,
        currentPage: paginationQuery?.page,
        totalPages: totalPages,
      },
      links: {
        first: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQuery.limit}&page=1`,
        last: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQuery.limit}&page=${totalPages}`,
        current: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQuery.limit}&page=${paginationQuery?.page}`,
        next: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQuery.limit}&page=${nextPage}`,
        previous: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQuery.limit}&page=${previousPage}`,
      },
    };

    return finalResponse;
  }
}
