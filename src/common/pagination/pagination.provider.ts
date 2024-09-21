import { Inject, Injectable } from '@nestjs/common';
import { PaginationQueryDto } from './dtos/pagination-query.dto';
import { ObjectLiteral, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

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
  ) {
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

    return results;
  }
}
