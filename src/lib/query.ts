type SortOrder = 'asc' | 'desc';

export class PrismaQueryBuilder<T extends object> {
  private query: any = {};

  where(field: keyof T, value: any) {
    this.query.where = { ...(this.query.where || {}), [field]: value };
    return this;
  }

  whereIn(field: keyof T, values: any[]) {
    this.query.where = {
      ...(this.query.where || {}),
      [field]: { in: values },
    };
    return this;
  }

  orderBy(field: keyof T, direction: SortOrder) {
    this.query.orderBy = { [field]: direction };
    return this;
  }

  omit(field: keyof T) {
    this.query.omit = { [field]: true };
    return this;
  }

  include(fields: (keyof T)[]) {
    this.query.include = fields.reduce(
      (acc, field) => {
        acc[field] = true;
        return acc;
      },
      {} as Record<keyof T, boolean>
    );
    return this;
  }

  select(fields: (keyof T)[]) {
    this.query.select = fields.reduce(
      (acc, field) => {
        acc[field] = true;
        return acc;
      },
      {} as Record<keyof T, boolean>
    );
    return this;
  }

  take(limit: number) {
    this.query.take = limit;
    return this;
  }

  skip(offset: number) {
    this.query.skip = offset;
    return this;
  }

  build() {
    return this.query;
  }
}
