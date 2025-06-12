
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model academic_year
 * 
 */
export type academic_year = $Result.DefaultSelection<Prisma.$academic_yearPayload>
/**
 * Model book
 * 
 */
export type book = $Result.DefaultSelection<Prisma.$bookPayload>
/**
 * Model chapter
 * 
 */
export type chapter = $Result.DefaultSelection<Prisma.$chapterPayload>
/**
 * Model grade
 * 
 */
export type grade = $Result.DefaultSelection<Prisma.$gradePayload>
/**
 * Model lesson
 * 
 */
export type lesson = $Result.DefaultSelection<Prisma.$lessonPayload>
/**
 * Model refresh_token
 * 
 */
export type refresh_token = $Result.DefaultSelection<Prisma.$refresh_tokenPayload>
/**
 * Model subject
 * 
 */
export type subject = $Result.DefaultSelection<Prisma.$subjectPayload>
/**
 * Model user
 * 
 */
export type user = $Result.DefaultSelection<Prisma.$userPayload>
/**
 * Model work_space
 * 
 */
export type work_space = $Result.DefaultSelection<Prisma.$work_spacePayload>
/**
 * Model book_type
 * 
 */
export type book_type = $Result.DefaultSelection<Prisma.$book_typePayload>

/**
 * Enums
 */
export namespace $Enums {
  export const subject_status: {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
};

export type subject_status = (typeof subject_status)[keyof typeof subject_status]


export const chapter_status: {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
};

export type chapter_status = (typeof chapter_status)[keyof typeof chapter_status]


export const book_status: {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
};

export type book_status = (typeof book_status)[keyof typeof book_status]


export const grade_status: {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
};

export type grade_status = (typeof grade_status)[keyof typeof grade_status]


export const lesson_status: {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
};

export type lesson_status = (typeof lesson_status)[keyof typeof lesson_status]


export const user_role: {
  TEACHER: 'TEACHER',
  ADMIN: 'ADMIN',
  STAFF: 'STAFF'
};

export type user_role = (typeof user_role)[keyof typeof user_role]


export const academic_year_status: {
  INACTIVE: 'INACTIVE',
  ACTIVE: 'ACTIVE',
  UPCOMING: 'UPCOMING'
};

export type academic_year_status = (typeof academic_year_status)[keyof typeof academic_year_status]


export const book_type_status: {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
};

export type book_type_status = (typeof book_type_status)[keyof typeof book_type_status]

}

export type subject_status = $Enums.subject_status

export const subject_status: typeof $Enums.subject_status

export type chapter_status = $Enums.chapter_status

export const chapter_status: typeof $Enums.chapter_status

export type book_status = $Enums.book_status

export const book_status: typeof $Enums.book_status

export type grade_status = $Enums.grade_status

export const grade_status: typeof $Enums.grade_status

export type lesson_status = $Enums.lesson_status

export const lesson_status: typeof $Enums.lesson_status

export type user_role = $Enums.user_role

export const user_role: typeof $Enums.user_role

export type academic_year_status = $Enums.academic_year_status

export const academic_year_status: typeof $Enums.academic_year_status

export type book_type_status = $Enums.book_type_status

export const book_type_status: typeof $Enums.book_type_status

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Academic_years
 * const academic_years = await prisma.academic_year.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Academic_years
   * const academic_years = await prisma.academic_year.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.academic_year`: Exposes CRUD operations for the **academic_year** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Academic_years
    * const academic_years = await prisma.academic_year.findMany()
    * ```
    */
  get academic_year(): Prisma.academic_yearDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.book`: Exposes CRUD operations for the **book** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Books
    * const books = await prisma.book.findMany()
    * ```
    */
  get book(): Prisma.bookDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.chapter`: Exposes CRUD operations for the **chapter** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Chapters
    * const chapters = await prisma.chapter.findMany()
    * ```
    */
  get chapter(): Prisma.chapterDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.grade`: Exposes CRUD operations for the **grade** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Grades
    * const grades = await prisma.grade.findMany()
    * ```
    */
  get grade(): Prisma.gradeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.lesson`: Exposes CRUD operations for the **lesson** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Lessons
    * const lessons = await prisma.lesson.findMany()
    * ```
    */
  get lesson(): Prisma.lessonDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.refresh_token`: Exposes CRUD operations for the **refresh_token** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Refresh_tokens
    * const refresh_tokens = await prisma.refresh_token.findMany()
    * ```
    */
  get refresh_token(): Prisma.refresh_tokenDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.subject`: Exposes CRUD operations for the **subject** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Subjects
    * const subjects = await prisma.subject.findMany()
    * ```
    */
  get subject(): Prisma.subjectDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **user** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.userDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.work_space`: Exposes CRUD operations for the **work_space** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Work_spaces
    * const work_spaces = await prisma.work_space.findMany()
    * ```
    */
  get work_space(): Prisma.work_spaceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.book_type`: Exposes CRUD operations for the **book_type** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Book_types
    * const book_types = await prisma.book_type.findMany()
    * ```
    */
  get book_type(): Prisma.book_typeDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.9.0
   * Query Engine version: 81e4af48011447c3cc503a190e86995b66d2a28e
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    academic_year: 'academic_year',
    book: 'book',
    chapter: 'chapter',
    grade: 'grade',
    lesson: 'lesson',
    refresh_token: 'refresh_token',
    subject: 'subject',
    user: 'user',
    work_space: 'work_space',
    book_type: 'book_type'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "academic_year" | "book" | "chapter" | "grade" | "lesson" | "refresh_token" | "subject" | "user" | "work_space" | "book_type"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      academic_year: {
        payload: Prisma.$academic_yearPayload<ExtArgs>
        fields: Prisma.academic_yearFieldRefs
        operations: {
          findUnique: {
            args: Prisma.academic_yearFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$academic_yearPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.academic_yearFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$academic_yearPayload>
          }
          findFirst: {
            args: Prisma.academic_yearFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$academic_yearPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.academic_yearFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$academic_yearPayload>
          }
          findMany: {
            args: Prisma.academic_yearFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$academic_yearPayload>[]
          }
          create: {
            args: Prisma.academic_yearCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$academic_yearPayload>
          }
          createMany: {
            args: Prisma.academic_yearCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.academic_yearDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$academic_yearPayload>
          }
          update: {
            args: Prisma.academic_yearUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$academic_yearPayload>
          }
          deleteMany: {
            args: Prisma.academic_yearDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.academic_yearUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.academic_yearUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$academic_yearPayload>
          }
          aggregate: {
            args: Prisma.Academic_yearAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAcademic_year>
          }
          groupBy: {
            args: Prisma.academic_yearGroupByArgs<ExtArgs>
            result: $Utils.Optional<Academic_yearGroupByOutputType>[]
          }
          count: {
            args: Prisma.academic_yearCountArgs<ExtArgs>
            result: $Utils.Optional<Academic_yearCountAggregateOutputType> | number
          }
        }
      }
      book: {
        payload: Prisma.$bookPayload<ExtArgs>
        fields: Prisma.bookFieldRefs
        operations: {
          findUnique: {
            args: Prisma.bookFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bookPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.bookFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bookPayload>
          }
          findFirst: {
            args: Prisma.bookFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bookPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.bookFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bookPayload>
          }
          findMany: {
            args: Prisma.bookFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bookPayload>[]
          }
          create: {
            args: Prisma.bookCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bookPayload>
          }
          createMany: {
            args: Prisma.bookCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.bookDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bookPayload>
          }
          update: {
            args: Prisma.bookUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bookPayload>
          }
          deleteMany: {
            args: Prisma.bookDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.bookUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.bookUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bookPayload>
          }
          aggregate: {
            args: Prisma.BookAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBook>
          }
          groupBy: {
            args: Prisma.bookGroupByArgs<ExtArgs>
            result: $Utils.Optional<BookGroupByOutputType>[]
          }
          count: {
            args: Prisma.bookCountArgs<ExtArgs>
            result: $Utils.Optional<BookCountAggregateOutputType> | number
          }
        }
      }
      chapter: {
        payload: Prisma.$chapterPayload<ExtArgs>
        fields: Prisma.chapterFieldRefs
        operations: {
          findUnique: {
            args: Prisma.chapterFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$chapterPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.chapterFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$chapterPayload>
          }
          findFirst: {
            args: Prisma.chapterFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$chapterPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.chapterFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$chapterPayload>
          }
          findMany: {
            args: Prisma.chapterFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$chapterPayload>[]
          }
          create: {
            args: Prisma.chapterCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$chapterPayload>
          }
          createMany: {
            args: Prisma.chapterCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.chapterDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$chapterPayload>
          }
          update: {
            args: Prisma.chapterUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$chapterPayload>
          }
          deleteMany: {
            args: Prisma.chapterDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.chapterUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.chapterUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$chapterPayload>
          }
          aggregate: {
            args: Prisma.ChapterAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChapter>
          }
          groupBy: {
            args: Prisma.chapterGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChapterGroupByOutputType>[]
          }
          count: {
            args: Prisma.chapterCountArgs<ExtArgs>
            result: $Utils.Optional<ChapterCountAggregateOutputType> | number
          }
        }
      }
      grade: {
        payload: Prisma.$gradePayload<ExtArgs>
        fields: Prisma.gradeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.gradeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$gradePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.gradeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$gradePayload>
          }
          findFirst: {
            args: Prisma.gradeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$gradePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.gradeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$gradePayload>
          }
          findMany: {
            args: Prisma.gradeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$gradePayload>[]
          }
          create: {
            args: Prisma.gradeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$gradePayload>
          }
          createMany: {
            args: Prisma.gradeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.gradeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$gradePayload>
          }
          update: {
            args: Prisma.gradeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$gradePayload>
          }
          deleteMany: {
            args: Prisma.gradeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.gradeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.gradeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$gradePayload>
          }
          aggregate: {
            args: Prisma.GradeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGrade>
          }
          groupBy: {
            args: Prisma.gradeGroupByArgs<ExtArgs>
            result: $Utils.Optional<GradeGroupByOutputType>[]
          }
          count: {
            args: Prisma.gradeCountArgs<ExtArgs>
            result: $Utils.Optional<GradeCountAggregateOutputType> | number
          }
        }
      }
      lesson: {
        payload: Prisma.$lessonPayload<ExtArgs>
        fields: Prisma.lessonFieldRefs
        operations: {
          findUnique: {
            args: Prisma.lessonFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lessonPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.lessonFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lessonPayload>
          }
          findFirst: {
            args: Prisma.lessonFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lessonPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.lessonFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lessonPayload>
          }
          findMany: {
            args: Prisma.lessonFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lessonPayload>[]
          }
          create: {
            args: Prisma.lessonCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lessonPayload>
          }
          createMany: {
            args: Prisma.lessonCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.lessonDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lessonPayload>
          }
          update: {
            args: Prisma.lessonUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lessonPayload>
          }
          deleteMany: {
            args: Prisma.lessonDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.lessonUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.lessonUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lessonPayload>
          }
          aggregate: {
            args: Prisma.LessonAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLesson>
          }
          groupBy: {
            args: Prisma.lessonGroupByArgs<ExtArgs>
            result: $Utils.Optional<LessonGroupByOutputType>[]
          }
          count: {
            args: Prisma.lessonCountArgs<ExtArgs>
            result: $Utils.Optional<LessonCountAggregateOutputType> | number
          }
        }
      }
      refresh_token: {
        payload: Prisma.$refresh_tokenPayload<ExtArgs>
        fields: Prisma.refresh_tokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.refresh_tokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$refresh_tokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.refresh_tokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$refresh_tokenPayload>
          }
          findFirst: {
            args: Prisma.refresh_tokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$refresh_tokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.refresh_tokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$refresh_tokenPayload>
          }
          findMany: {
            args: Prisma.refresh_tokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$refresh_tokenPayload>[]
          }
          create: {
            args: Prisma.refresh_tokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$refresh_tokenPayload>
          }
          createMany: {
            args: Prisma.refresh_tokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.refresh_tokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$refresh_tokenPayload>
          }
          update: {
            args: Prisma.refresh_tokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$refresh_tokenPayload>
          }
          deleteMany: {
            args: Prisma.refresh_tokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.refresh_tokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.refresh_tokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$refresh_tokenPayload>
          }
          aggregate: {
            args: Prisma.Refresh_tokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRefresh_token>
          }
          groupBy: {
            args: Prisma.refresh_tokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<Refresh_tokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.refresh_tokenCountArgs<ExtArgs>
            result: $Utils.Optional<Refresh_tokenCountAggregateOutputType> | number
          }
        }
      }
      subject: {
        payload: Prisma.$subjectPayload<ExtArgs>
        fields: Prisma.subjectFieldRefs
        operations: {
          findUnique: {
            args: Prisma.subjectFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subjectPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.subjectFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subjectPayload>
          }
          findFirst: {
            args: Prisma.subjectFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subjectPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.subjectFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subjectPayload>
          }
          findMany: {
            args: Prisma.subjectFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subjectPayload>[]
          }
          create: {
            args: Prisma.subjectCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subjectPayload>
          }
          createMany: {
            args: Prisma.subjectCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.subjectDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subjectPayload>
          }
          update: {
            args: Prisma.subjectUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subjectPayload>
          }
          deleteMany: {
            args: Prisma.subjectDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.subjectUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.subjectUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subjectPayload>
          }
          aggregate: {
            args: Prisma.SubjectAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSubject>
          }
          groupBy: {
            args: Prisma.subjectGroupByArgs<ExtArgs>
            result: $Utils.Optional<SubjectGroupByOutputType>[]
          }
          count: {
            args: Prisma.subjectCountArgs<ExtArgs>
            result: $Utils.Optional<SubjectCountAggregateOutputType> | number
          }
        }
      }
      user: {
        payload: Prisma.$userPayload<ExtArgs>
        fields: Prisma.userFieldRefs
        operations: {
          findUnique: {
            args: Prisma.userFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.userFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>
          }
          findFirst: {
            args: Prisma.userFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.userFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>
          }
          findMany: {
            args: Prisma.userFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>[]
          }
          create: {
            args: Prisma.userCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>
          }
          createMany: {
            args: Prisma.userCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.userDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>
          }
          update: {
            args: Prisma.userUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>
          }
          deleteMany: {
            args: Prisma.userDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.userUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.userUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.userGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.userCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      work_space: {
        payload: Prisma.$work_spacePayload<ExtArgs>
        fields: Prisma.work_spaceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.work_spaceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$work_spacePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.work_spaceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$work_spacePayload>
          }
          findFirst: {
            args: Prisma.work_spaceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$work_spacePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.work_spaceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$work_spacePayload>
          }
          findMany: {
            args: Prisma.work_spaceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$work_spacePayload>[]
          }
          create: {
            args: Prisma.work_spaceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$work_spacePayload>
          }
          createMany: {
            args: Prisma.work_spaceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.work_spaceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$work_spacePayload>
          }
          update: {
            args: Prisma.work_spaceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$work_spacePayload>
          }
          deleteMany: {
            args: Prisma.work_spaceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.work_spaceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.work_spaceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$work_spacePayload>
          }
          aggregate: {
            args: Prisma.Work_spaceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWork_space>
          }
          groupBy: {
            args: Prisma.work_spaceGroupByArgs<ExtArgs>
            result: $Utils.Optional<Work_spaceGroupByOutputType>[]
          }
          count: {
            args: Prisma.work_spaceCountArgs<ExtArgs>
            result: $Utils.Optional<Work_spaceCountAggregateOutputType> | number
          }
        }
      }
      book_type: {
        payload: Prisma.$book_typePayload<ExtArgs>
        fields: Prisma.book_typeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.book_typeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$book_typePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.book_typeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$book_typePayload>
          }
          findFirst: {
            args: Prisma.book_typeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$book_typePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.book_typeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$book_typePayload>
          }
          findMany: {
            args: Prisma.book_typeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$book_typePayload>[]
          }
          create: {
            args: Prisma.book_typeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$book_typePayload>
          }
          createMany: {
            args: Prisma.book_typeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.book_typeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$book_typePayload>
          }
          update: {
            args: Prisma.book_typeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$book_typePayload>
          }
          deleteMany: {
            args: Prisma.book_typeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.book_typeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.book_typeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$book_typePayload>
          }
          aggregate: {
            args: Prisma.Book_typeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBook_type>
          }
          groupBy: {
            args: Prisma.book_typeGroupByArgs<ExtArgs>
            result: $Utils.Optional<Book_typeGroupByOutputType>[]
          }
          count: {
            args: Prisma.book_typeCountArgs<ExtArgs>
            result: $Utils.Optional<Book_typeCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    academic_year?: academic_yearOmit
    book?: bookOmit
    chapter?: chapterOmit
    grade?: gradeOmit
    lesson?: lessonOmit
    refresh_token?: refresh_tokenOmit
    subject?: subjectOmit
    user?: userOmit
    work_space?: work_spaceOmit
    book_type?: book_typeOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type Academic_yearCountOutputType
   */

  export type Academic_yearCountOutputType = {
    work_space: number
  }

  export type Academic_yearCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    work_space?: boolean | Academic_yearCountOutputTypeCountWork_spaceArgs
  }

  // Custom InputTypes
  /**
   * Academic_yearCountOutputType without action
   */
  export type Academic_yearCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Academic_yearCountOutputType
     */
    select?: Academic_yearCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * Academic_yearCountOutputType without action
   */
  export type Academic_yearCountOutputTypeCountWork_spaceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: work_spaceWhereInput
  }


  /**
   * Count Type BookCountOutputType
   */

  export type BookCountOutputType = {
    chapter: number
  }

  export type BookCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    chapter?: boolean | BookCountOutputTypeCountChapterArgs
  }

  // Custom InputTypes
  /**
   * BookCountOutputType without action
   */
  export type BookCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookCountOutputType
     */
    select?: BookCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BookCountOutputType without action
   */
  export type BookCountOutputTypeCountChapterArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: chapterWhereInput
  }


  /**
   * Count Type ChapterCountOutputType
   */

  export type ChapterCountOutputType = {
    lesson: number
  }

  export type ChapterCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lesson?: boolean | ChapterCountOutputTypeCountLessonArgs
  }

  // Custom InputTypes
  /**
   * ChapterCountOutputType without action
   */
  export type ChapterCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChapterCountOutputType
     */
    select?: ChapterCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ChapterCountOutputType without action
   */
  export type ChapterCountOutputTypeCountLessonArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: lessonWhereInput
  }


  /**
   * Count Type GradeCountOutputType
   */

  export type GradeCountOutputType = {
    subject: number
  }

  export type GradeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    subject?: boolean | GradeCountOutputTypeCountSubjectArgs
  }

  // Custom InputTypes
  /**
   * GradeCountOutputType without action
   */
  export type GradeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GradeCountOutputType
     */
    select?: GradeCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * GradeCountOutputType without action
   */
  export type GradeCountOutputTypeCountSubjectArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: subjectWhereInput
  }


  /**
   * Count Type SubjectCountOutputType
   */

  export type SubjectCountOutputType = {
    book: number
  }

  export type SubjectCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    book?: boolean | SubjectCountOutputTypeCountBookArgs
  }

  // Custom InputTypes
  /**
   * SubjectCountOutputType without action
   */
  export type SubjectCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubjectCountOutputType
     */
    select?: SubjectCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SubjectCountOutputType without action
   */
  export type SubjectCountOutputTypeCountBookArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: bookWhereInput
  }


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    refresh_token: number
    work_space: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    refresh_token?: boolean | UserCountOutputTypeCountRefresh_tokenArgs
    work_space?: boolean | UserCountOutputTypeCountWork_spaceArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountRefresh_tokenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: refresh_tokenWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountWork_spaceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: work_spaceWhereInput
  }


  /**
   * Models
   */

  /**
   * Model academic_year
   */

  export type AggregateAcademic_year = {
    _count: Academic_yearCountAggregateOutputType | null
    _min: Academic_yearMinAggregateOutputType | null
    _max: Academic_yearMaxAggregateOutputType | null
  }

  export type Academic_yearMinAggregateOutputType = {
    id: Uint8Array | null
    created_at: Date | null
    end_date: Date | null
    start_date: Date | null
    status: $Enums.academic_year_status | null
    updated_at: Date | null
    year_label: string | null
  }

  export type Academic_yearMaxAggregateOutputType = {
    id: Uint8Array | null
    created_at: Date | null
    end_date: Date | null
    start_date: Date | null
    status: $Enums.academic_year_status | null
    updated_at: Date | null
    year_label: string | null
  }

  export type Academic_yearCountAggregateOutputType = {
    id: number
    created_at: number
    end_date: number
    start_date: number
    status: number
    updated_at: number
    year_label: number
    _all: number
  }


  export type Academic_yearMinAggregateInputType = {
    id?: true
    created_at?: true
    end_date?: true
    start_date?: true
    status?: true
    updated_at?: true
    year_label?: true
  }

  export type Academic_yearMaxAggregateInputType = {
    id?: true
    created_at?: true
    end_date?: true
    start_date?: true
    status?: true
    updated_at?: true
    year_label?: true
  }

  export type Academic_yearCountAggregateInputType = {
    id?: true
    created_at?: true
    end_date?: true
    start_date?: true
    status?: true
    updated_at?: true
    year_label?: true
    _all?: true
  }

  export type Academic_yearAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which academic_year to aggregate.
     */
    where?: academic_yearWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of academic_years to fetch.
     */
    orderBy?: academic_yearOrderByWithRelationInput | academic_yearOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: academic_yearWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` academic_years from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` academic_years.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned academic_years
    **/
    _count?: true | Academic_yearCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Academic_yearMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Academic_yearMaxAggregateInputType
  }

  export type GetAcademic_yearAggregateType<T extends Academic_yearAggregateArgs> = {
        [P in keyof T & keyof AggregateAcademic_year]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAcademic_year[P]>
      : GetScalarType<T[P], AggregateAcademic_year[P]>
  }




  export type academic_yearGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: academic_yearWhereInput
    orderBy?: academic_yearOrderByWithAggregationInput | academic_yearOrderByWithAggregationInput[]
    by: Academic_yearScalarFieldEnum[] | Academic_yearScalarFieldEnum
    having?: academic_yearScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Academic_yearCountAggregateInputType | true
    _min?: Academic_yearMinAggregateInputType
    _max?: Academic_yearMaxAggregateInputType
  }

  export type Academic_yearGroupByOutputType = {
    id: Uint8Array
    created_at: Date | null
    end_date: Date | null
    start_date: Date | null
    status: $Enums.academic_year_status | null
    updated_at: Date | null
    year_label: string | null
    _count: Academic_yearCountAggregateOutputType | null
    _min: Academic_yearMinAggregateOutputType | null
    _max: Academic_yearMaxAggregateOutputType | null
  }

  type GetAcademic_yearGroupByPayload<T extends academic_yearGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Academic_yearGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Academic_yearGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Academic_yearGroupByOutputType[P]>
            : GetScalarType<T[P], Academic_yearGroupByOutputType[P]>
        }
      >
    >


  export type academic_yearSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    created_at?: boolean
    end_date?: boolean
    start_date?: boolean
    status?: boolean
    updated_at?: boolean
    year_label?: boolean
    work_space?: boolean | academic_year$work_spaceArgs<ExtArgs>
    _count?: boolean | Academic_yearCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["academic_year"]>



  export type academic_yearSelectScalar = {
    id?: boolean
    created_at?: boolean
    end_date?: boolean
    start_date?: boolean
    status?: boolean
    updated_at?: boolean
    year_label?: boolean
  }

  export type academic_yearOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "created_at" | "end_date" | "start_date" | "status" | "updated_at" | "year_label", ExtArgs["result"]["academic_year"]>
  export type academic_yearInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    work_space?: boolean | academic_year$work_spaceArgs<ExtArgs>
    _count?: boolean | Academic_yearCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $academic_yearPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "academic_year"
    objects: {
      work_space: Prisma.$work_spacePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: Uint8Array
      created_at: Date | null
      end_date: Date | null
      start_date: Date | null
      status: $Enums.academic_year_status | null
      updated_at: Date | null
      year_label: string | null
    }, ExtArgs["result"]["academic_year"]>
    composites: {}
  }

  type academic_yearGetPayload<S extends boolean | null | undefined | academic_yearDefaultArgs> = $Result.GetResult<Prisma.$academic_yearPayload, S>

  type academic_yearCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<academic_yearFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Academic_yearCountAggregateInputType | true
    }

  export interface academic_yearDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['academic_year'], meta: { name: 'academic_year' } }
    /**
     * Find zero or one Academic_year that matches the filter.
     * @param {academic_yearFindUniqueArgs} args - Arguments to find a Academic_year
     * @example
     * // Get one Academic_year
     * const academic_year = await prisma.academic_year.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends academic_yearFindUniqueArgs>(args: SelectSubset<T, academic_yearFindUniqueArgs<ExtArgs>>): Prisma__academic_yearClient<$Result.GetResult<Prisma.$academic_yearPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Academic_year that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {academic_yearFindUniqueOrThrowArgs} args - Arguments to find a Academic_year
     * @example
     * // Get one Academic_year
     * const academic_year = await prisma.academic_year.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends academic_yearFindUniqueOrThrowArgs>(args: SelectSubset<T, academic_yearFindUniqueOrThrowArgs<ExtArgs>>): Prisma__academic_yearClient<$Result.GetResult<Prisma.$academic_yearPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Academic_year that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {academic_yearFindFirstArgs} args - Arguments to find a Academic_year
     * @example
     * // Get one Academic_year
     * const academic_year = await prisma.academic_year.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends academic_yearFindFirstArgs>(args?: SelectSubset<T, academic_yearFindFirstArgs<ExtArgs>>): Prisma__academic_yearClient<$Result.GetResult<Prisma.$academic_yearPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Academic_year that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {academic_yearFindFirstOrThrowArgs} args - Arguments to find a Academic_year
     * @example
     * // Get one Academic_year
     * const academic_year = await prisma.academic_year.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends academic_yearFindFirstOrThrowArgs>(args?: SelectSubset<T, academic_yearFindFirstOrThrowArgs<ExtArgs>>): Prisma__academic_yearClient<$Result.GetResult<Prisma.$academic_yearPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Academic_years that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {academic_yearFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Academic_years
     * const academic_years = await prisma.academic_year.findMany()
     * 
     * // Get first 10 Academic_years
     * const academic_years = await prisma.academic_year.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const academic_yearWithIdOnly = await prisma.academic_year.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends academic_yearFindManyArgs>(args?: SelectSubset<T, academic_yearFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$academic_yearPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Academic_year.
     * @param {academic_yearCreateArgs} args - Arguments to create a Academic_year.
     * @example
     * // Create one Academic_year
     * const Academic_year = await prisma.academic_year.create({
     *   data: {
     *     // ... data to create a Academic_year
     *   }
     * })
     * 
     */
    create<T extends academic_yearCreateArgs>(args: SelectSubset<T, academic_yearCreateArgs<ExtArgs>>): Prisma__academic_yearClient<$Result.GetResult<Prisma.$academic_yearPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Academic_years.
     * @param {academic_yearCreateManyArgs} args - Arguments to create many Academic_years.
     * @example
     * // Create many Academic_years
     * const academic_year = await prisma.academic_year.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends academic_yearCreateManyArgs>(args?: SelectSubset<T, academic_yearCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Academic_year.
     * @param {academic_yearDeleteArgs} args - Arguments to delete one Academic_year.
     * @example
     * // Delete one Academic_year
     * const Academic_year = await prisma.academic_year.delete({
     *   where: {
     *     // ... filter to delete one Academic_year
     *   }
     * })
     * 
     */
    delete<T extends academic_yearDeleteArgs>(args: SelectSubset<T, academic_yearDeleteArgs<ExtArgs>>): Prisma__academic_yearClient<$Result.GetResult<Prisma.$academic_yearPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Academic_year.
     * @param {academic_yearUpdateArgs} args - Arguments to update one Academic_year.
     * @example
     * // Update one Academic_year
     * const academic_year = await prisma.academic_year.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends academic_yearUpdateArgs>(args: SelectSubset<T, academic_yearUpdateArgs<ExtArgs>>): Prisma__academic_yearClient<$Result.GetResult<Prisma.$academic_yearPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Academic_years.
     * @param {academic_yearDeleteManyArgs} args - Arguments to filter Academic_years to delete.
     * @example
     * // Delete a few Academic_years
     * const { count } = await prisma.academic_year.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends academic_yearDeleteManyArgs>(args?: SelectSubset<T, academic_yearDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Academic_years.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {academic_yearUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Academic_years
     * const academic_year = await prisma.academic_year.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends academic_yearUpdateManyArgs>(args: SelectSubset<T, academic_yearUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Academic_year.
     * @param {academic_yearUpsertArgs} args - Arguments to update or create a Academic_year.
     * @example
     * // Update or create a Academic_year
     * const academic_year = await prisma.academic_year.upsert({
     *   create: {
     *     // ... data to create a Academic_year
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Academic_year we want to update
     *   }
     * })
     */
    upsert<T extends academic_yearUpsertArgs>(args: SelectSubset<T, academic_yearUpsertArgs<ExtArgs>>): Prisma__academic_yearClient<$Result.GetResult<Prisma.$academic_yearPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Academic_years.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {academic_yearCountArgs} args - Arguments to filter Academic_years to count.
     * @example
     * // Count the number of Academic_years
     * const count = await prisma.academic_year.count({
     *   where: {
     *     // ... the filter for the Academic_years we want to count
     *   }
     * })
    **/
    count<T extends academic_yearCountArgs>(
      args?: Subset<T, academic_yearCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Academic_yearCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Academic_year.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Academic_yearAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Academic_yearAggregateArgs>(args: Subset<T, Academic_yearAggregateArgs>): Prisma.PrismaPromise<GetAcademic_yearAggregateType<T>>

    /**
     * Group by Academic_year.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {academic_yearGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends academic_yearGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: academic_yearGroupByArgs['orderBy'] }
        : { orderBy?: academic_yearGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, academic_yearGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAcademic_yearGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the academic_year model
   */
  readonly fields: academic_yearFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for academic_year.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__academic_yearClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    work_space<T extends academic_year$work_spaceArgs<ExtArgs> = {}>(args?: Subset<T, academic_year$work_spaceArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$work_spacePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the academic_year model
   */
  interface academic_yearFieldRefs {
    readonly id: FieldRef<"academic_year", 'Bytes'>
    readonly created_at: FieldRef<"academic_year", 'DateTime'>
    readonly end_date: FieldRef<"academic_year", 'DateTime'>
    readonly start_date: FieldRef<"academic_year", 'DateTime'>
    readonly status: FieldRef<"academic_year", 'academic_year_status'>
    readonly updated_at: FieldRef<"academic_year", 'DateTime'>
    readonly year_label: FieldRef<"academic_year", 'String'>
  }
    

  // Custom InputTypes
  /**
   * academic_year findUnique
   */
  export type academic_yearFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the academic_year
     */
    select?: academic_yearSelect<ExtArgs> | null
    /**
     * Omit specific fields from the academic_year
     */
    omit?: academic_yearOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: academic_yearInclude<ExtArgs> | null
    /**
     * Filter, which academic_year to fetch.
     */
    where: academic_yearWhereUniqueInput
  }

  /**
   * academic_year findUniqueOrThrow
   */
  export type academic_yearFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the academic_year
     */
    select?: academic_yearSelect<ExtArgs> | null
    /**
     * Omit specific fields from the academic_year
     */
    omit?: academic_yearOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: academic_yearInclude<ExtArgs> | null
    /**
     * Filter, which academic_year to fetch.
     */
    where: academic_yearWhereUniqueInput
  }

  /**
   * academic_year findFirst
   */
  export type academic_yearFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the academic_year
     */
    select?: academic_yearSelect<ExtArgs> | null
    /**
     * Omit specific fields from the academic_year
     */
    omit?: academic_yearOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: academic_yearInclude<ExtArgs> | null
    /**
     * Filter, which academic_year to fetch.
     */
    where?: academic_yearWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of academic_years to fetch.
     */
    orderBy?: academic_yearOrderByWithRelationInput | academic_yearOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for academic_years.
     */
    cursor?: academic_yearWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` academic_years from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` academic_years.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of academic_years.
     */
    distinct?: Academic_yearScalarFieldEnum | Academic_yearScalarFieldEnum[]
  }

  /**
   * academic_year findFirstOrThrow
   */
  export type academic_yearFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the academic_year
     */
    select?: academic_yearSelect<ExtArgs> | null
    /**
     * Omit specific fields from the academic_year
     */
    omit?: academic_yearOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: academic_yearInclude<ExtArgs> | null
    /**
     * Filter, which academic_year to fetch.
     */
    where?: academic_yearWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of academic_years to fetch.
     */
    orderBy?: academic_yearOrderByWithRelationInput | academic_yearOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for academic_years.
     */
    cursor?: academic_yearWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` academic_years from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` academic_years.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of academic_years.
     */
    distinct?: Academic_yearScalarFieldEnum | Academic_yearScalarFieldEnum[]
  }

  /**
   * academic_year findMany
   */
  export type academic_yearFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the academic_year
     */
    select?: academic_yearSelect<ExtArgs> | null
    /**
     * Omit specific fields from the academic_year
     */
    omit?: academic_yearOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: academic_yearInclude<ExtArgs> | null
    /**
     * Filter, which academic_years to fetch.
     */
    where?: academic_yearWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of academic_years to fetch.
     */
    orderBy?: academic_yearOrderByWithRelationInput | academic_yearOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing academic_years.
     */
    cursor?: academic_yearWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` academic_years from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` academic_years.
     */
    skip?: number
    distinct?: Academic_yearScalarFieldEnum | Academic_yearScalarFieldEnum[]
  }

  /**
   * academic_year create
   */
  export type academic_yearCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the academic_year
     */
    select?: academic_yearSelect<ExtArgs> | null
    /**
     * Omit specific fields from the academic_year
     */
    omit?: academic_yearOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: academic_yearInclude<ExtArgs> | null
    /**
     * The data needed to create a academic_year.
     */
    data: XOR<academic_yearCreateInput, academic_yearUncheckedCreateInput>
  }

  /**
   * academic_year createMany
   */
  export type academic_yearCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many academic_years.
     */
    data: academic_yearCreateManyInput | academic_yearCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * academic_year update
   */
  export type academic_yearUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the academic_year
     */
    select?: academic_yearSelect<ExtArgs> | null
    /**
     * Omit specific fields from the academic_year
     */
    omit?: academic_yearOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: academic_yearInclude<ExtArgs> | null
    /**
     * The data needed to update a academic_year.
     */
    data: XOR<academic_yearUpdateInput, academic_yearUncheckedUpdateInput>
    /**
     * Choose, which academic_year to update.
     */
    where: academic_yearWhereUniqueInput
  }

  /**
   * academic_year updateMany
   */
  export type academic_yearUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update academic_years.
     */
    data: XOR<academic_yearUpdateManyMutationInput, academic_yearUncheckedUpdateManyInput>
    /**
     * Filter which academic_years to update
     */
    where?: academic_yearWhereInput
    /**
     * Limit how many academic_years to update.
     */
    limit?: number
  }

  /**
   * academic_year upsert
   */
  export type academic_yearUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the academic_year
     */
    select?: academic_yearSelect<ExtArgs> | null
    /**
     * Omit specific fields from the academic_year
     */
    omit?: academic_yearOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: academic_yearInclude<ExtArgs> | null
    /**
     * The filter to search for the academic_year to update in case it exists.
     */
    where: academic_yearWhereUniqueInput
    /**
     * In case the academic_year found by the `where` argument doesn't exist, create a new academic_year with this data.
     */
    create: XOR<academic_yearCreateInput, academic_yearUncheckedCreateInput>
    /**
     * In case the academic_year was found with the provided `where` argument, update it with this data.
     */
    update: XOR<academic_yearUpdateInput, academic_yearUncheckedUpdateInput>
  }

  /**
   * academic_year delete
   */
  export type academic_yearDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the academic_year
     */
    select?: academic_yearSelect<ExtArgs> | null
    /**
     * Omit specific fields from the academic_year
     */
    omit?: academic_yearOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: academic_yearInclude<ExtArgs> | null
    /**
     * Filter which academic_year to delete.
     */
    where: academic_yearWhereUniqueInput
  }

  /**
   * academic_year deleteMany
   */
  export type academic_yearDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which academic_years to delete
     */
    where?: academic_yearWhereInput
    /**
     * Limit how many academic_years to delete.
     */
    limit?: number
  }

  /**
   * academic_year.work_space
   */
  export type academic_year$work_spaceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the work_space
     */
    select?: work_spaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the work_space
     */
    omit?: work_spaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: work_spaceInclude<ExtArgs> | null
    where?: work_spaceWhereInput
    orderBy?: work_spaceOrderByWithRelationInput | work_spaceOrderByWithRelationInput[]
    cursor?: work_spaceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Work_spaceScalarFieldEnum | Work_spaceScalarFieldEnum[]
  }

  /**
   * academic_year without action
   */
  export type academic_yearDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the academic_year
     */
    select?: academic_yearSelect<ExtArgs> | null
    /**
     * Omit specific fields from the academic_year
     */
    omit?: academic_yearOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: academic_yearInclude<ExtArgs> | null
  }


  /**
   * Model book
   */

  export type AggregateBook = {
    _count: BookCountAggregateOutputType | null
    _avg: BookAvgAggregateOutputType | null
    _sum: BookSumAggregateOutputType | null
    _min: BookMinAggregateOutputType | null
    _max: BookMaxAggregateOutputType | null
  }

  export type BookAvgAggregateOutputType = {
    id: number | null
    subject_id: number | null
  }

  export type BookSumAggregateOutputType = {
    id: bigint | null
    subject_id: bigint | null
  }

  export type BookMinAggregateOutputType = {
    id: bigint | null
    created_at: string | null
    name: string | null
    status: $Enums.book_status | null
    updated_at: string | null
    subject_id: bigint | null
  }

  export type BookMaxAggregateOutputType = {
    id: bigint | null
    created_at: string | null
    name: string | null
    status: $Enums.book_status | null
    updated_at: string | null
    subject_id: bigint | null
  }

  export type BookCountAggregateOutputType = {
    id: number
    created_at: number
    name: number
    status: number
    updated_at: number
    subject_id: number
    _all: number
  }


  export type BookAvgAggregateInputType = {
    id?: true
    subject_id?: true
  }

  export type BookSumAggregateInputType = {
    id?: true
    subject_id?: true
  }

  export type BookMinAggregateInputType = {
    id?: true
    created_at?: true
    name?: true
    status?: true
    updated_at?: true
    subject_id?: true
  }

  export type BookMaxAggregateInputType = {
    id?: true
    created_at?: true
    name?: true
    status?: true
    updated_at?: true
    subject_id?: true
  }

  export type BookCountAggregateInputType = {
    id?: true
    created_at?: true
    name?: true
    status?: true
    updated_at?: true
    subject_id?: true
    _all?: true
  }

  export type BookAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which book to aggregate.
     */
    where?: bookWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of books to fetch.
     */
    orderBy?: bookOrderByWithRelationInput | bookOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: bookWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` books from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` books.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned books
    **/
    _count?: true | BookCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BookAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BookSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BookMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BookMaxAggregateInputType
  }

  export type GetBookAggregateType<T extends BookAggregateArgs> = {
        [P in keyof T & keyof AggregateBook]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBook[P]>
      : GetScalarType<T[P], AggregateBook[P]>
  }




  export type bookGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: bookWhereInput
    orderBy?: bookOrderByWithAggregationInput | bookOrderByWithAggregationInput[]
    by: BookScalarFieldEnum[] | BookScalarFieldEnum
    having?: bookScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BookCountAggregateInputType | true
    _avg?: BookAvgAggregateInputType
    _sum?: BookSumAggregateInputType
    _min?: BookMinAggregateInputType
    _max?: BookMaxAggregateInputType
  }

  export type BookGroupByOutputType = {
    id: bigint
    created_at: string | null
    name: string
    status: $Enums.book_status | null
    updated_at: string | null
    subject_id: bigint | null
    _count: BookCountAggregateOutputType | null
    _avg: BookAvgAggregateOutputType | null
    _sum: BookSumAggregateOutputType | null
    _min: BookMinAggregateOutputType | null
    _max: BookMaxAggregateOutputType | null
  }

  type GetBookGroupByPayload<T extends bookGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BookGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BookGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BookGroupByOutputType[P]>
            : GetScalarType<T[P], BookGroupByOutputType[P]>
        }
      >
    >


  export type bookSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    created_at?: boolean
    name?: boolean
    status?: boolean
    updated_at?: boolean
    subject_id?: boolean
    subject?: boolean | book$subjectArgs<ExtArgs>
    chapter?: boolean | book$chapterArgs<ExtArgs>
    _count?: boolean | BookCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["book"]>



  export type bookSelectScalar = {
    id?: boolean
    created_at?: boolean
    name?: boolean
    status?: boolean
    updated_at?: boolean
    subject_id?: boolean
  }

  export type bookOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "created_at" | "name" | "status" | "updated_at" | "subject_id", ExtArgs["result"]["book"]>
  export type bookInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    subject?: boolean | book$subjectArgs<ExtArgs>
    chapter?: boolean | book$chapterArgs<ExtArgs>
    _count?: boolean | BookCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $bookPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "book"
    objects: {
      subject: Prisma.$subjectPayload<ExtArgs> | null
      chapter: Prisma.$chapterPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      created_at: string | null
      name: string
      status: $Enums.book_status | null
      updated_at: string | null
      subject_id: bigint | null
    }, ExtArgs["result"]["book"]>
    composites: {}
  }

  type bookGetPayload<S extends boolean | null | undefined | bookDefaultArgs> = $Result.GetResult<Prisma.$bookPayload, S>

  type bookCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<bookFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BookCountAggregateInputType | true
    }

  export interface bookDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['book'], meta: { name: 'book' } }
    /**
     * Find zero or one Book that matches the filter.
     * @param {bookFindUniqueArgs} args - Arguments to find a Book
     * @example
     * // Get one Book
     * const book = await prisma.book.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends bookFindUniqueArgs>(args: SelectSubset<T, bookFindUniqueArgs<ExtArgs>>): Prisma__bookClient<$Result.GetResult<Prisma.$bookPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Book that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {bookFindUniqueOrThrowArgs} args - Arguments to find a Book
     * @example
     * // Get one Book
     * const book = await prisma.book.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends bookFindUniqueOrThrowArgs>(args: SelectSubset<T, bookFindUniqueOrThrowArgs<ExtArgs>>): Prisma__bookClient<$Result.GetResult<Prisma.$bookPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Book that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {bookFindFirstArgs} args - Arguments to find a Book
     * @example
     * // Get one Book
     * const book = await prisma.book.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends bookFindFirstArgs>(args?: SelectSubset<T, bookFindFirstArgs<ExtArgs>>): Prisma__bookClient<$Result.GetResult<Prisma.$bookPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Book that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {bookFindFirstOrThrowArgs} args - Arguments to find a Book
     * @example
     * // Get one Book
     * const book = await prisma.book.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends bookFindFirstOrThrowArgs>(args?: SelectSubset<T, bookFindFirstOrThrowArgs<ExtArgs>>): Prisma__bookClient<$Result.GetResult<Prisma.$bookPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Books that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {bookFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Books
     * const books = await prisma.book.findMany()
     * 
     * // Get first 10 Books
     * const books = await prisma.book.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bookWithIdOnly = await prisma.book.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends bookFindManyArgs>(args?: SelectSubset<T, bookFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$bookPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Book.
     * @param {bookCreateArgs} args - Arguments to create a Book.
     * @example
     * // Create one Book
     * const Book = await prisma.book.create({
     *   data: {
     *     // ... data to create a Book
     *   }
     * })
     * 
     */
    create<T extends bookCreateArgs>(args: SelectSubset<T, bookCreateArgs<ExtArgs>>): Prisma__bookClient<$Result.GetResult<Prisma.$bookPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Books.
     * @param {bookCreateManyArgs} args - Arguments to create many Books.
     * @example
     * // Create many Books
     * const book = await prisma.book.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends bookCreateManyArgs>(args?: SelectSubset<T, bookCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Book.
     * @param {bookDeleteArgs} args - Arguments to delete one Book.
     * @example
     * // Delete one Book
     * const Book = await prisma.book.delete({
     *   where: {
     *     // ... filter to delete one Book
     *   }
     * })
     * 
     */
    delete<T extends bookDeleteArgs>(args: SelectSubset<T, bookDeleteArgs<ExtArgs>>): Prisma__bookClient<$Result.GetResult<Prisma.$bookPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Book.
     * @param {bookUpdateArgs} args - Arguments to update one Book.
     * @example
     * // Update one Book
     * const book = await prisma.book.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends bookUpdateArgs>(args: SelectSubset<T, bookUpdateArgs<ExtArgs>>): Prisma__bookClient<$Result.GetResult<Prisma.$bookPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Books.
     * @param {bookDeleteManyArgs} args - Arguments to filter Books to delete.
     * @example
     * // Delete a few Books
     * const { count } = await prisma.book.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends bookDeleteManyArgs>(args?: SelectSubset<T, bookDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Books.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {bookUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Books
     * const book = await prisma.book.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends bookUpdateManyArgs>(args: SelectSubset<T, bookUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Book.
     * @param {bookUpsertArgs} args - Arguments to update or create a Book.
     * @example
     * // Update or create a Book
     * const book = await prisma.book.upsert({
     *   create: {
     *     // ... data to create a Book
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Book we want to update
     *   }
     * })
     */
    upsert<T extends bookUpsertArgs>(args: SelectSubset<T, bookUpsertArgs<ExtArgs>>): Prisma__bookClient<$Result.GetResult<Prisma.$bookPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Books.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {bookCountArgs} args - Arguments to filter Books to count.
     * @example
     * // Count the number of Books
     * const count = await prisma.book.count({
     *   where: {
     *     // ... the filter for the Books we want to count
     *   }
     * })
    **/
    count<T extends bookCountArgs>(
      args?: Subset<T, bookCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BookCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Book.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BookAggregateArgs>(args: Subset<T, BookAggregateArgs>): Prisma.PrismaPromise<GetBookAggregateType<T>>

    /**
     * Group by Book.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {bookGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends bookGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: bookGroupByArgs['orderBy'] }
        : { orderBy?: bookGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, bookGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBookGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the book model
   */
  readonly fields: bookFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for book.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__bookClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    subject<T extends book$subjectArgs<ExtArgs> = {}>(args?: Subset<T, book$subjectArgs<ExtArgs>>): Prisma__subjectClient<$Result.GetResult<Prisma.$subjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    chapter<T extends book$chapterArgs<ExtArgs> = {}>(args?: Subset<T, book$chapterArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$chapterPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the book model
   */
  interface bookFieldRefs {
    readonly id: FieldRef<"book", 'BigInt'>
    readonly created_at: FieldRef<"book", 'String'>
    readonly name: FieldRef<"book", 'String'>
    readonly status: FieldRef<"book", 'book_status'>
    readonly updated_at: FieldRef<"book", 'String'>
    readonly subject_id: FieldRef<"book", 'BigInt'>
  }
    

  // Custom InputTypes
  /**
   * book findUnique
   */
  export type bookFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the book
     */
    select?: bookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the book
     */
    omit?: bookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookInclude<ExtArgs> | null
    /**
     * Filter, which book to fetch.
     */
    where: bookWhereUniqueInput
  }

  /**
   * book findUniqueOrThrow
   */
  export type bookFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the book
     */
    select?: bookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the book
     */
    omit?: bookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookInclude<ExtArgs> | null
    /**
     * Filter, which book to fetch.
     */
    where: bookWhereUniqueInput
  }

  /**
   * book findFirst
   */
  export type bookFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the book
     */
    select?: bookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the book
     */
    omit?: bookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookInclude<ExtArgs> | null
    /**
     * Filter, which book to fetch.
     */
    where?: bookWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of books to fetch.
     */
    orderBy?: bookOrderByWithRelationInput | bookOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for books.
     */
    cursor?: bookWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` books from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` books.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of books.
     */
    distinct?: BookScalarFieldEnum | BookScalarFieldEnum[]
  }

  /**
   * book findFirstOrThrow
   */
  export type bookFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the book
     */
    select?: bookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the book
     */
    omit?: bookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookInclude<ExtArgs> | null
    /**
     * Filter, which book to fetch.
     */
    where?: bookWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of books to fetch.
     */
    orderBy?: bookOrderByWithRelationInput | bookOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for books.
     */
    cursor?: bookWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` books from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` books.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of books.
     */
    distinct?: BookScalarFieldEnum | BookScalarFieldEnum[]
  }

  /**
   * book findMany
   */
  export type bookFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the book
     */
    select?: bookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the book
     */
    omit?: bookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookInclude<ExtArgs> | null
    /**
     * Filter, which books to fetch.
     */
    where?: bookWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of books to fetch.
     */
    orderBy?: bookOrderByWithRelationInput | bookOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing books.
     */
    cursor?: bookWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` books from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` books.
     */
    skip?: number
    distinct?: BookScalarFieldEnum | BookScalarFieldEnum[]
  }

  /**
   * book create
   */
  export type bookCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the book
     */
    select?: bookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the book
     */
    omit?: bookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookInclude<ExtArgs> | null
    /**
     * The data needed to create a book.
     */
    data: XOR<bookCreateInput, bookUncheckedCreateInput>
  }

  /**
   * book createMany
   */
  export type bookCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many books.
     */
    data: bookCreateManyInput | bookCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * book update
   */
  export type bookUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the book
     */
    select?: bookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the book
     */
    omit?: bookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookInclude<ExtArgs> | null
    /**
     * The data needed to update a book.
     */
    data: XOR<bookUpdateInput, bookUncheckedUpdateInput>
    /**
     * Choose, which book to update.
     */
    where: bookWhereUniqueInput
  }

  /**
   * book updateMany
   */
  export type bookUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update books.
     */
    data: XOR<bookUpdateManyMutationInput, bookUncheckedUpdateManyInput>
    /**
     * Filter which books to update
     */
    where?: bookWhereInput
    /**
     * Limit how many books to update.
     */
    limit?: number
  }

  /**
   * book upsert
   */
  export type bookUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the book
     */
    select?: bookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the book
     */
    omit?: bookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookInclude<ExtArgs> | null
    /**
     * The filter to search for the book to update in case it exists.
     */
    where: bookWhereUniqueInput
    /**
     * In case the book found by the `where` argument doesn't exist, create a new book with this data.
     */
    create: XOR<bookCreateInput, bookUncheckedCreateInput>
    /**
     * In case the book was found with the provided `where` argument, update it with this data.
     */
    update: XOR<bookUpdateInput, bookUncheckedUpdateInput>
  }

  /**
   * book delete
   */
  export type bookDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the book
     */
    select?: bookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the book
     */
    omit?: bookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookInclude<ExtArgs> | null
    /**
     * Filter which book to delete.
     */
    where: bookWhereUniqueInput
  }

  /**
   * book deleteMany
   */
  export type bookDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which books to delete
     */
    where?: bookWhereInput
    /**
     * Limit how many books to delete.
     */
    limit?: number
  }

  /**
   * book.subject
   */
  export type book$subjectArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subject
     */
    select?: subjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subject
     */
    omit?: subjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: subjectInclude<ExtArgs> | null
    where?: subjectWhereInput
  }

  /**
   * book.chapter
   */
  export type book$chapterArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chapter
     */
    select?: chapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the chapter
     */
    omit?: chapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: chapterInclude<ExtArgs> | null
    where?: chapterWhereInput
    orderBy?: chapterOrderByWithRelationInput | chapterOrderByWithRelationInput[]
    cursor?: chapterWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChapterScalarFieldEnum | ChapterScalarFieldEnum[]
  }

  /**
   * book without action
   */
  export type bookDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the book
     */
    select?: bookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the book
     */
    omit?: bookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookInclude<ExtArgs> | null
  }


  /**
   * Model chapter
   */

  export type AggregateChapter = {
    _count: ChapterCountAggregateOutputType | null
    _avg: ChapterAvgAggregateOutputType | null
    _sum: ChapterSumAggregateOutputType | null
    _min: ChapterMinAggregateOutputType | null
    _max: ChapterMaxAggregateOutputType | null
  }

  export type ChapterAvgAggregateOutputType = {
    id: number | null
    book_id: number | null
  }

  export type ChapterSumAggregateOutputType = {
    id: bigint | null
    book_id: bigint | null
  }

  export type ChapterMinAggregateOutputType = {
    id: bigint | null
    created_at: string | null
    name: string | null
    status: $Enums.chapter_status | null
    updated_at: string | null
    book_id: bigint | null
  }

  export type ChapterMaxAggregateOutputType = {
    id: bigint | null
    created_at: string | null
    name: string | null
    status: $Enums.chapter_status | null
    updated_at: string | null
    book_id: bigint | null
  }

  export type ChapterCountAggregateOutputType = {
    id: number
    created_at: number
    name: number
    status: number
    updated_at: number
    book_id: number
    _all: number
  }


  export type ChapterAvgAggregateInputType = {
    id?: true
    book_id?: true
  }

  export type ChapterSumAggregateInputType = {
    id?: true
    book_id?: true
  }

  export type ChapterMinAggregateInputType = {
    id?: true
    created_at?: true
    name?: true
    status?: true
    updated_at?: true
    book_id?: true
  }

  export type ChapterMaxAggregateInputType = {
    id?: true
    created_at?: true
    name?: true
    status?: true
    updated_at?: true
    book_id?: true
  }

  export type ChapterCountAggregateInputType = {
    id?: true
    created_at?: true
    name?: true
    status?: true
    updated_at?: true
    book_id?: true
    _all?: true
  }

  export type ChapterAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which chapter to aggregate.
     */
    where?: chapterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of chapters to fetch.
     */
    orderBy?: chapterOrderByWithRelationInput | chapterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: chapterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` chapters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` chapters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned chapters
    **/
    _count?: true | ChapterCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ChapterAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ChapterSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChapterMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChapterMaxAggregateInputType
  }

  export type GetChapterAggregateType<T extends ChapterAggregateArgs> = {
        [P in keyof T & keyof AggregateChapter]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChapter[P]>
      : GetScalarType<T[P], AggregateChapter[P]>
  }




  export type chapterGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: chapterWhereInput
    orderBy?: chapterOrderByWithAggregationInput | chapterOrderByWithAggregationInput[]
    by: ChapterScalarFieldEnum[] | ChapterScalarFieldEnum
    having?: chapterScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChapterCountAggregateInputType | true
    _avg?: ChapterAvgAggregateInputType
    _sum?: ChapterSumAggregateInputType
    _min?: ChapterMinAggregateInputType
    _max?: ChapterMaxAggregateInputType
  }

  export type ChapterGroupByOutputType = {
    id: bigint
    created_at: string | null
    name: string
    status: $Enums.chapter_status | null
    updated_at: string | null
    book_id: bigint | null
    _count: ChapterCountAggregateOutputType | null
    _avg: ChapterAvgAggregateOutputType | null
    _sum: ChapterSumAggregateOutputType | null
    _min: ChapterMinAggregateOutputType | null
    _max: ChapterMaxAggregateOutputType | null
  }

  type GetChapterGroupByPayload<T extends chapterGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChapterGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChapterGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChapterGroupByOutputType[P]>
            : GetScalarType<T[P], ChapterGroupByOutputType[P]>
        }
      >
    >


  export type chapterSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    created_at?: boolean
    name?: boolean
    status?: boolean
    updated_at?: boolean
    book_id?: boolean
    book?: boolean | chapter$bookArgs<ExtArgs>
    lesson?: boolean | chapter$lessonArgs<ExtArgs>
    _count?: boolean | ChapterCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chapter"]>



  export type chapterSelectScalar = {
    id?: boolean
    created_at?: boolean
    name?: boolean
    status?: boolean
    updated_at?: boolean
    book_id?: boolean
  }

  export type chapterOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "created_at" | "name" | "status" | "updated_at" | "book_id", ExtArgs["result"]["chapter"]>
  export type chapterInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    book?: boolean | chapter$bookArgs<ExtArgs>
    lesson?: boolean | chapter$lessonArgs<ExtArgs>
    _count?: boolean | ChapterCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $chapterPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "chapter"
    objects: {
      book: Prisma.$bookPayload<ExtArgs> | null
      lesson: Prisma.$lessonPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      created_at: string | null
      name: string
      status: $Enums.chapter_status | null
      updated_at: string | null
      book_id: bigint | null
    }, ExtArgs["result"]["chapter"]>
    composites: {}
  }

  type chapterGetPayload<S extends boolean | null | undefined | chapterDefaultArgs> = $Result.GetResult<Prisma.$chapterPayload, S>

  type chapterCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<chapterFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ChapterCountAggregateInputType | true
    }

  export interface chapterDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['chapter'], meta: { name: 'chapter' } }
    /**
     * Find zero or one Chapter that matches the filter.
     * @param {chapterFindUniqueArgs} args - Arguments to find a Chapter
     * @example
     * // Get one Chapter
     * const chapter = await prisma.chapter.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends chapterFindUniqueArgs>(args: SelectSubset<T, chapterFindUniqueArgs<ExtArgs>>): Prisma__chapterClient<$Result.GetResult<Prisma.$chapterPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Chapter that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {chapterFindUniqueOrThrowArgs} args - Arguments to find a Chapter
     * @example
     * // Get one Chapter
     * const chapter = await prisma.chapter.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends chapterFindUniqueOrThrowArgs>(args: SelectSubset<T, chapterFindUniqueOrThrowArgs<ExtArgs>>): Prisma__chapterClient<$Result.GetResult<Prisma.$chapterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Chapter that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {chapterFindFirstArgs} args - Arguments to find a Chapter
     * @example
     * // Get one Chapter
     * const chapter = await prisma.chapter.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends chapterFindFirstArgs>(args?: SelectSubset<T, chapterFindFirstArgs<ExtArgs>>): Prisma__chapterClient<$Result.GetResult<Prisma.$chapterPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Chapter that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {chapterFindFirstOrThrowArgs} args - Arguments to find a Chapter
     * @example
     * // Get one Chapter
     * const chapter = await prisma.chapter.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends chapterFindFirstOrThrowArgs>(args?: SelectSubset<T, chapterFindFirstOrThrowArgs<ExtArgs>>): Prisma__chapterClient<$Result.GetResult<Prisma.$chapterPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Chapters that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {chapterFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Chapters
     * const chapters = await prisma.chapter.findMany()
     * 
     * // Get first 10 Chapters
     * const chapters = await prisma.chapter.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const chapterWithIdOnly = await prisma.chapter.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends chapterFindManyArgs>(args?: SelectSubset<T, chapterFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$chapterPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Chapter.
     * @param {chapterCreateArgs} args - Arguments to create a Chapter.
     * @example
     * // Create one Chapter
     * const Chapter = await prisma.chapter.create({
     *   data: {
     *     // ... data to create a Chapter
     *   }
     * })
     * 
     */
    create<T extends chapterCreateArgs>(args: SelectSubset<T, chapterCreateArgs<ExtArgs>>): Prisma__chapterClient<$Result.GetResult<Prisma.$chapterPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Chapters.
     * @param {chapterCreateManyArgs} args - Arguments to create many Chapters.
     * @example
     * // Create many Chapters
     * const chapter = await prisma.chapter.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends chapterCreateManyArgs>(args?: SelectSubset<T, chapterCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Chapter.
     * @param {chapterDeleteArgs} args - Arguments to delete one Chapter.
     * @example
     * // Delete one Chapter
     * const Chapter = await prisma.chapter.delete({
     *   where: {
     *     // ... filter to delete one Chapter
     *   }
     * })
     * 
     */
    delete<T extends chapterDeleteArgs>(args: SelectSubset<T, chapterDeleteArgs<ExtArgs>>): Prisma__chapterClient<$Result.GetResult<Prisma.$chapterPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Chapter.
     * @param {chapterUpdateArgs} args - Arguments to update one Chapter.
     * @example
     * // Update one Chapter
     * const chapter = await prisma.chapter.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends chapterUpdateArgs>(args: SelectSubset<T, chapterUpdateArgs<ExtArgs>>): Prisma__chapterClient<$Result.GetResult<Prisma.$chapterPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Chapters.
     * @param {chapterDeleteManyArgs} args - Arguments to filter Chapters to delete.
     * @example
     * // Delete a few Chapters
     * const { count } = await prisma.chapter.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends chapterDeleteManyArgs>(args?: SelectSubset<T, chapterDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Chapters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {chapterUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Chapters
     * const chapter = await prisma.chapter.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends chapterUpdateManyArgs>(args: SelectSubset<T, chapterUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Chapter.
     * @param {chapterUpsertArgs} args - Arguments to update or create a Chapter.
     * @example
     * // Update or create a Chapter
     * const chapter = await prisma.chapter.upsert({
     *   create: {
     *     // ... data to create a Chapter
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Chapter we want to update
     *   }
     * })
     */
    upsert<T extends chapterUpsertArgs>(args: SelectSubset<T, chapterUpsertArgs<ExtArgs>>): Prisma__chapterClient<$Result.GetResult<Prisma.$chapterPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Chapters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {chapterCountArgs} args - Arguments to filter Chapters to count.
     * @example
     * // Count the number of Chapters
     * const count = await prisma.chapter.count({
     *   where: {
     *     // ... the filter for the Chapters we want to count
     *   }
     * })
    **/
    count<T extends chapterCountArgs>(
      args?: Subset<T, chapterCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChapterCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Chapter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChapterAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ChapterAggregateArgs>(args: Subset<T, ChapterAggregateArgs>): Prisma.PrismaPromise<GetChapterAggregateType<T>>

    /**
     * Group by Chapter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {chapterGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends chapterGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: chapterGroupByArgs['orderBy'] }
        : { orderBy?: chapterGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, chapterGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChapterGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the chapter model
   */
  readonly fields: chapterFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for chapter.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__chapterClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    book<T extends chapter$bookArgs<ExtArgs> = {}>(args?: Subset<T, chapter$bookArgs<ExtArgs>>): Prisma__bookClient<$Result.GetResult<Prisma.$bookPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    lesson<T extends chapter$lessonArgs<ExtArgs> = {}>(args?: Subset<T, chapter$lessonArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$lessonPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the chapter model
   */
  interface chapterFieldRefs {
    readonly id: FieldRef<"chapter", 'BigInt'>
    readonly created_at: FieldRef<"chapter", 'String'>
    readonly name: FieldRef<"chapter", 'String'>
    readonly status: FieldRef<"chapter", 'chapter_status'>
    readonly updated_at: FieldRef<"chapter", 'String'>
    readonly book_id: FieldRef<"chapter", 'BigInt'>
  }
    

  // Custom InputTypes
  /**
   * chapter findUnique
   */
  export type chapterFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chapter
     */
    select?: chapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the chapter
     */
    omit?: chapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: chapterInclude<ExtArgs> | null
    /**
     * Filter, which chapter to fetch.
     */
    where: chapterWhereUniqueInput
  }

  /**
   * chapter findUniqueOrThrow
   */
  export type chapterFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chapter
     */
    select?: chapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the chapter
     */
    omit?: chapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: chapterInclude<ExtArgs> | null
    /**
     * Filter, which chapter to fetch.
     */
    where: chapterWhereUniqueInput
  }

  /**
   * chapter findFirst
   */
  export type chapterFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chapter
     */
    select?: chapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the chapter
     */
    omit?: chapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: chapterInclude<ExtArgs> | null
    /**
     * Filter, which chapter to fetch.
     */
    where?: chapterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of chapters to fetch.
     */
    orderBy?: chapterOrderByWithRelationInput | chapterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for chapters.
     */
    cursor?: chapterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` chapters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` chapters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of chapters.
     */
    distinct?: ChapterScalarFieldEnum | ChapterScalarFieldEnum[]
  }

  /**
   * chapter findFirstOrThrow
   */
  export type chapterFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chapter
     */
    select?: chapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the chapter
     */
    omit?: chapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: chapterInclude<ExtArgs> | null
    /**
     * Filter, which chapter to fetch.
     */
    where?: chapterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of chapters to fetch.
     */
    orderBy?: chapterOrderByWithRelationInput | chapterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for chapters.
     */
    cursor?: chapterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` chapters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` chapters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of chapters.
     */
    distinct?: ChapterScalarFieldEnum | ChapterScalarFieldEnum[]
  }

  /**
   * chapter findMany
   */
  export type chapterFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chapter
     */
    select?: chapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the chapter
     */
    omit?: chapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: chapterInclude<ExtArgs> | null
    /**
     * Filter, which chapters to fetch.
     */
    where?: chapterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of chapters to fetch.
     */
    orderBy?: chapterOrderByWithRelationInput | chapterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing chapters.
     */
    cursor?: chapterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` chapters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` chapters.
     */
    skip?: number
    distinct?: ChapterScalarFieldEnum | ChapterScalarFieldEnum[]
  }

  /**
   * chapter create
   */
  export type chapterCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chapter
     */
    select?: chapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the chapter
     */
    omit?: chapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: chapterInclude<ExtArgs> | null
    /**
     * The data needed to create a chapter.
     */
    data: XOR<chapterCreateInput, chapterUncheckedCreateInput>
  }

  /**
   * chapter createMany
   */
  export type chapterCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many chapters.
     */
    data: chapterCreateManyInput | chapterCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * chapter update
   */
  export type chapterUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chapter
     */
    select?: chapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the chapter
     */
    omit?: chapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: chapterInclude<ExtArgs> | null
    /**
     * The data needed to update a chapter.
     */
    data: XOR<chapterUpdateInput, chapterUncheckedUpdateInput>
    /**
     * Choose, which chapter to update.
     */
    where: chapterWhereUniqueInput
  }

  /**
   * chapter updateMany
   */
  export type chapterUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update chapters.
     */
    data: XOR<chapterUpdateManyMutationInput, chapterUncheckedUpdateManyInput>
    /**
     * Filter which chapters to update
     */
    where?: chapterWhereInput
    /**
     * Limit how many chapters to update.
     */
    limit?: number
  }

  /**
   * chapter upsert
   */
  export type chapterUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chapter
     */
    select?: chapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the chapter
     */
    omit?: chapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: chapterInclude<ExtArgs> | null
    /**
     * The filter to search for the chapter to update in case it exists.
     */
    where: chapterWhereUniqueInput
    /**
     * In case the chapter found by the `where` argument doesn't exist, create a new chapter with this data.
     */
    create: XOR<chapterCreateInput, chapterUncheckedCreateInput>
    /**
     * In case the chapter was found with the provided `where` argument, update it with this data.
     */
    update: XOR<chapterUpdateInput, chapterUncheckedUpdateInput>
  }

  /**
   * chapter delete
   */
  export type chapterDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chapter
     */
    select?: chapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the chapter
     */
    omit?: chapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: chapterInclude<ExtArgs> | null
    /**
     * Filter which chapter to delete.
     */
    where: chapterWhereUniqueInput
  }

  /**
   * chapter deleteMany
   */
  export type chapterDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which chapters to delete
     */
    where?: chapterWhereInput
    /**
     * Limit how many chapters to delete.
     */
    limit?: number
  }

  /**
   * chapter.book
   */
  export type chapter$bookArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the book
     */
    select?: bookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the book
     */
    omit?: bookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookInclude<ExtArgs> | null
    where?: bookWhereInput
  }

  /**
   * chapter.lesson
   */
  export type chapter$lessonArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lesson
     */
    select?: lessonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the lesson
     */
    omit?: lessonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lessonInclude<ExtArgs> | null
    where?: lessonWhereInput
    orderBy?: lessonOrderByWithRelationInput | lessonOrderByWithRelationInput[]
    cursor?: lessonWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LessonScalarFieldEnum | LessonScalarFieldEnum[]
  }

  /**
   * chapter without action
   */
  export type chapterDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chapter
     */
    select?: chapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the chapter
     */
    omit?: chapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: chapterInclude<ExtArgs> | null
  }


  /**
   * Model grade
   */

  export type AggregateGrade = {
    _count: GradeCountAggregateOutputType | null
    _avg: GradeAvgAggregateOutputType | null
    _sum: GradeSumAggregateOutputType | null
    _min: GradeMinAggregateOutputType | null
    _max: GradeMaxAggregateOutputType | null
  }

  export type GradeAvgAggregateOutputType = {
    id: number | null
  }

  export type GradeSumAggregateOutputType = {
    id: bigint | null
  }

  export type GradeMinAggregateOutputType = {
    id: bigint | null
    created_at: string | null
    name: string | null
    status: $Enums.grade_status | null
    updated_at: string | null
  }

  export type GradeMaxAggregateOutputType = {
    id: bigint | null
    created_at: string | null
    name: string | null
    status: $Enums.grade_status | null
    updated_at: string | null
  }

  export type GradeCountAggregateOutputType = {
    id: number
    created_at: number
    name: number
    status: number
    updated_at: number
    _all: number
  }


  export type GradeAvgAggregateInputType = {
    id?: true
  }

  export type GradeSumAggregateInputType = {
    id?: true
  }

  export type GradeMinAggregateInputType = {
    id?: true
    created_at?: true
    name?: true
    status?: true
    updated_at?: true
  }

  export type GradeMaxAggregateInputType = {
    id?: true
    created_at?: true
    name?: true
    status?: true
    updated_at?: true
  }

  export type GradeCountAggregateInputType = {
    id?: true
    created_at?: true
    name?: true
    status?: true
    updated_at?: true
    _all?: true
  }

  export type GradeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which grade to aggregate.
     */
    where?: gradeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of grades to fetch.
     */
    orderBy?: gradeOrderByWithRelationInput | gradeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: gradeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` grades from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` grades.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned grades
    **/
    _count?: true | GradeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GradeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GradeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GradeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GradeMaxAggregateInputType
  }

  export type GetGradeAggregateType<T extends GradeAggregateArgs> = {
        [P in keyof T & keyof AggregateGrade]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGrade[P]>
      : GetScalarType<T[P], AggregateGrade[P]>
  }




  export type gradeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: gradeWhereInput
    orderBy?: gradeOrderByWithAggregationInput | gradeOrderByWithAggregationInput[]
    by: GradeScalarFieldEnum[] | GradeScalarFieldEnum
    having?: gradeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GradeCountAggregateInputType | true
    _avg?: GradeAvgAggregateInputType
    _sum?: GradeSumAggregateInputType
    _min?: GradeMinAggregateInputType
    _max?: GradeMaxAggregateInputType
  }

  export type GradeGroupByOutputType = {
    id: bigint
    created_at: string | null
    name: string
    status: $Enums.grade_status | null
    updated_at: string | null
    _count: GradeCountAggregateOutputType | null
    _avg: GradeAvgAggregateOutputType | null
    _sum: GradeSumAggregateOutputType | null
    _min: GradeMinAggregateOutputType | null
    _max: GradeMaxAggregateOutputType | null
  }

  type GetGradeGroupByPayload<T extends gradeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GradeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GradeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GradeGroupByOutputType[P]>
            : GetScalarType<T[P], GradeGroupByOutputType[P]>
        }
      >
    >


  export type gradeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    created_at?: boolean
    name?: boolean
    status?: boolean
    updated_at?: boolean
    subject?: boolean | grade$subjectArgs<ExtArgs>
    _count?: boolean | GradeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["grade"]>



  export type gradeSelectScalar = {
    id?: boolean
    created_at?: boolean
    name?: boolean
    status?: boolean
    updated_at?: boolean
  }

  export type gradeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "created_at" | "name" | "status" | "updated_at", ExtArgs["result"]["grade"]>
  export type gradeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    subject?: boolean | grade$subjectArgs<ExtArgs>
    _count?: boolean | GradeCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $gradePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "grade"
    objects: {
      subject: Prisma.$subjectPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      created_at: string | null
      name: string
      status: $Enums.grade_status | null
      updated_at: string | null
    }, ExtArgs["result"]["grade"]>
    composites: {}
  }

  type gradeGetPayload<S extends boolean | null | undefined | gradeDefaultArgs> = $Result.GetResult<Prisma.$gradePayload, S>

  type gradeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<gradeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GradeCountAggregateInputType | true
    }

  export interface gradeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['grade'], meta: { name: 'grade' } }
    /**
     * Find zero or one Grade that matches the filter.
     * @param {gradeFindUniqueArgs} args - Arguments to find a Grade
     * @example
     * // Get one Grade
     * const grade = await prisma.grade.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends gradeFindUniqueArgs>(args: SelectSubset<T, gradeFindUniqueArgs<ExtArgs>>): Prisma__gradeClient<$Result.GetResult<Prisma.$gradePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Grade that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {gradeFindUniqueOrThrowArgs} args - Arguments to find a Grade
     * @example
     * // Get one Grade
     * const grade = await prisma.grade.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends gradeFindUniqueOrThrowArgs>(args: SelectSubset<T, gradeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__gradeClient<$Result.GetResult<Prisma.$gradePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Grade that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {gradeFindFirstArgs} args - Arguments to find a Grade
     * @example
     * // Get one Grade
     * const grade = await prisma.grade.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends gradeFindFirstArgs>(args?: SelectSubset<T, gradeFindFirstArgs<ExtArgs>>): Prisma__gradeClient<$Result.GetResult<Prisma.$gradePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Grade that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {gradeFindFirstOrThrowArgs} args - Arguments to find a Grade
     * @example
     * // Get one Grade
     * const grade = await prisma.grade.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends gradeFindFirstOrThrowArgs>(args?: SelectSubset<T, gradeFindFirstOrThrowArgs<ExtArgs>>): Prisma__gradeClient<$Result.GetResult<Prisma.$gradePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Grades that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {gradeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Grades
     * const grades = await prisma.grade.findMany()
     * 
     * // Get first 10 Grades
     * const grades = await prisma.grade.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const gradeWithIdOnly = await prisma.grade.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends gradeFindManyArgs>(args?: SelectSubset<T, gradeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$gradePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Grade.
     * @param {gradeCreateArgs} args - Arguments to create a Grade.
     * @example
     * // Create one Grade
     * const Grade = await prisma.grade.create({
     *   data: {
     *     // ... data to create a Grade
     *   }
     * })
     * 
     */
    create<T extends gradeCreateArgs>(args: SelectSubset<T, gradeCreateArgs<ExtArgs>>): Prisma__gradeClient<$Result.GetResult<Prisma.$gradePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Grades.
     * @param {gradeCreateManyArgs} args - Arguments to create many Grades.
     * @example
     * // Create many Grades
     * const grade = await prisma.grade.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends gradeCreateManyArgs>(args?: SelectSubset<T, gradeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Grade.
     * @param {gradeDeleteArgs} args - Arguments to delete one Grade.
     * @example
     * // Delete one Grade
     * const Grade = await prisma.grade.delete({
     *   where: {
     *     // ... filter to delete one Grade
     *   }
     * })
     * 
     */
    delete<T extends gradeDeleteArgs>(args: SelectSubset<T, gradeDeleteArgs<ExtArgs>>): Prisma__gradeClient<$Result.GetResult<Prisma.$gradePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Grade.
     * @param {gradeUpdateArgs} args - Arguments to update one Grade.
     * @example
     * // Update one Grade
     * const grade = await prisma.grade.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends gradeUpdateArgs>(args: SelectSubset<T, gradeUpdateArgs<ExtArgs>>): Prisma__gradeClient<$Result.GetResult<Prisma.$gradePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Grades.
     * @param {gradeDeleteManyArgs} args - Arguments to filter Grades to delete.
     * @example
     * // Delete a few Grades
     * const { count } = await prisma.grade.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends gradeDeleteManyArgs>(args?: SelectSubset<T, gradeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Grades.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {gradeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Grades
     * const grade = await prisma.grade.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends gradeUpdateManyArgs>(args: SelectSubset<T, gradeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Grade.
     * @param {gradeUpsertArgs} args - Arguments to update or create a Grade.
     * @example
     * // Update or create a Grade
     * const grade = await prisma.grade.upsert({
     *   create: {
     *     // ... data to create a Grade
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Grade we want to update
     *   }
     * })
     */
    upsert<T extends gradeUpsertArgs>(args: SelectSubset<T, gradeUpsertArgs<ExtArgs>>): Prisma__gradeClient<$Result.GetResult<Prisma.$gradePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Grades.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {gradeCountArgs} args - Arguments to filter Grades to count.
     * @example
     * // Count the number of Grades
     * const count = await prisma.grade.count({
     *   where: {
     *     // ... the filter for the Grades we want to count
     *   }
     * })
    **/
    count<T extends gradeCountArgs>(
      args?: Subset<T, gradeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GradeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Grade.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GradeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GradeAggregateArgs>(args: Subset<T, GradeAggregateArgs>): Prisma.PrismaPromise<GetGradeAggregateType<T>>

    /**
     * Group by Grade.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {gradeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends gradeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: gradeGroupByArgs['orderBy'] }
        : { orderBy?: gradeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, gradeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGradeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the grade model
   */
  readonly fields: gradeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for grade.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__gradeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    subject<T extends grade$subjectArgs<ExtArgs> = {}>(args?: Subset<T, grade$subjectArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$subjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the grade model
   */
  interface gradeFieldRefs {
    readonly id: FieldRef<"grade", 'BigInt'>
    readonly created_at: FieldRef<"grade", 'String'>
    readonly name: FieldRef<"grade", 'String'>
    readonly status: FieldRef<"grade", 'grade_status'>
    readonly updated_at: FieldRef<"grade", 'String'>
  }
    

  // Custom InputTypes
  /**
   * grade findUnique
   */
  export type gradeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the grade
     */
    select?: gradeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the grade
     */
    omit?: gradeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: gradeInclude<ExtArgs> | null
    /**
     * Filter, which grade to fetch.
     */
    where: gradeWhereUniqueInput
  }

  /**
   * grade findUniqueOrThrow
   */
  export type gradeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the grade
     */
    select?: gradeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the grade
     */
    omit?: gradeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: gradeInclude<ExtArgs> | null
    /**
     * Filter, which grade to fetch.
     */
    where: gradeWhereUniqueInput
  }

  /**
   * grade findFirst
   */
  export type gradeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the grade
     */
    select?: gradeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the grade
     */
    omit?: gradeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: gradeInclude<ExtArgs> | null
    /**
     * Filter, which grade to fetch.
     */
    where?: gradeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of grades to fetch.
     */
    orderBy?: gradeOrderByWithRelationInput | gradeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for grades.
     */
    cursor?: gradeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` grades from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` grades.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of grades.
     */
    distinct?: GradeScalarFieldEnum | GradeScalarFieldEnum[]
  }

  /**
   * grade findFirstOrThrow
   */
  export type gradeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the grade
     */
    select?: gradeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the grade
     */
    omit?: gradeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: gradeInclude<ExtArgs> | null
    /**
     * Filter, which grade to fetch.
     */
    where?: gradeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of grades to fetch.
     */
    orderBy?: gradeOrderByWithRelationInput | gradeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for grades.
     */
    cursor?: gradeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` grades from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` grades.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of grades.
     */
    distinct?: GradeScalarFieldEnum | GradeScalarFieldEnum[]
  }

  /**
   * grade findMany
   */
  export type gradeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the grade
     */
    select?: gradeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the grade
     */
    omit?: gradeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: gradeInclude<ExtArgs> | null
    /**
     * Filter, which grades to fetch.
     */
    where?: gradeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of grades to fetch.
     */
    orderBy?: gradeOrderByWithRelationInput | gradeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing grades.
     */
    cursor?: gradeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` grades from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` grades.
     */
    skip?: number
    distinct?: GradeScalarFieldEnum | GradeScalarFieldEnum[]
  }

  /**
   * grade create
   */
  export type gradeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the grade
     */
    select?: gradeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the grade
     */
    omit?: gradeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: gradeInclude<ExtArgs> | null
    /**
     * The data needed to create a grade.
     */
    data: XOR<gradeCreateInput, gradeUncheckedCreateInput>
  }

  /**
   * grade createMany
   */
  export type gradeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many grades.
     */
    data: gradeCreateManyInput | gradeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * grade update
   */
  export type gradeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the grade
     */
    select?: gradeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the grade
     */
    omit?: gradeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: gradeInclude<ExtArgs> | null
    /**
     * The data needed to update a grade.
     */
    data: XOR<gradeUpdateInput, gradeUncheckedUpdateInput>
    /**
     * Choose, which grade to update.
     */
    where: gradeWhereUniqueInput
  }

  /**
   * grade updateMany
   */
  export type gradeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update grades.
     */
    data: XOR<gradeUpdateManyMutationInput, gradeUncheckedUpdateManyInput>
    /**
     * Filter which grades to update
     */
    where?: gradeWhereInput
    /**
     * Limit how many grades to update.
     */
    limit?: number
  }

  /**
   * grade upsert
   */
  export type gradeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the grade
     */
    select?: gradeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the grade
     */
    omit?: gradeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: gradeInclude<ExtArgs> | null
    /**
     * The filter to search for the grade to update in case it exists.
     */
    where: gradeWhereUniqueInput
    /**
     * In case the grade found by the `where` argument doesn't exist, create a new grade with this data.
     */
    create: XOR<gradeCreateInput, gradeUncheckedCreateInput>
    /**
     * In case the grade was found with the provided `where` argument, update it with this data.
     */
    update: XOR<gradeUpdateInput, gradeUncheckedUpdateInput>
  }

  /**
   * grade delete
   */
  export type gradeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the grade
     */
    select?: gradeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the grade
     */
    omit?: gradeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: gradeInclude<ExtArgs> | null
    /**
     * Filter which grade to delete.
     */
    where: gradeWhereUniqueInput
  }

  /**
   * grade deleteMany
   */
  export type gradeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which grades to delete
     */
    where?: gradeWhereInput
    /**
     * Limit how many grades to delete.
     */
    limit?: number
  }

  /**
   * grade.subject
   */
  export type grade$subjectArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subject
     */
    select?: subjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subject
     */
    omit?: subjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: subjectInclude<ExtArgs> | null
    where?: subjectWhereInput
    orderBy?: subjectOrderByWithRelationInput | subjectOrderByWithRelationInput[]
    cursor?: subjectWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SubjectScalarFieldEnum | SubjectScalarFieldEnum[]
  }

  /**
   * grade without action
   */
  export type gradeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the grade
     */
    select?: gradeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the grade
     */
    omit?: gradeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: gradeInclude<ExtArgs> | null
  }


  /**
   * Model lesson
   */

  export type AggregateLesson = {
    _count: LessonCountAggregateOutputType | null
    _avg: LessonAvgAggregateOutputType | null
    _sum: LessonSumAggregateOutputType | null
    _min: LessonMinAggregateOutputType | null
    _max: LessonMaxAggregateOutputType | null
  }

  export type LessonAvgAggregateOutputType = {
    id: number | null
    chapter_id: number | null
  }

  export type LessonSumAggregateOutputType = {
    id: bigint | null
    chapter_id: bigint | null
  }

  export type LessonMinAggregateOutputType = {
    id: bigint | null
    created_at: string | null
    name: string | null
    status: $Enums.lesson_status | null
    updated_at: string | null
    chapter_id: bigint | null
  }

  export type LessonMaxAggregateOutputType = {
    id: bigint | null
    created_at: string | null
    name: string | null
    status: $Enums.lesson_status | null
    updated_at: string | null
    chapter_id: bigint | null
  }

  export type LessonCountAggregateOutputType = {
    id: number
    created_at: number
    name: number
    status: number
    updated_at: number
    chapter_id: number
    _all: number
  }


  export type LessonAvgAggregateInputType = {
    id?: true
    chapter_id?: true
  }

  export type LessonSumAggregateInputType = {
    id?: true
    chapter_id?: true
  }

  export type LessonMinAggregateInputType = {
    id?: true
    created_at?: true
    name?: true
    status?: true
    updated_at?: true
    chapter_id?: true
  }

  export type LessonMaxAggregateInputType = {
    id?: true
    created_at?: true
    name?: true
    status?: true
    updated_at?: true
    chapter_id?: true
  }

  export type LessonCountAggregateInputType = {
    id?: true
    created_at?: true
    name?: true
    status?: true
    updated_at?: true
    chapter_id?: true
    _all?: true
  }

  export type LessonAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which lesson to aggregate.
     */
    where?: lessonWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of lessons to fetch.
     */
    orderBy?: lessonOrderByWithRelationInput | lessonOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: lessonWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` lessons from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` lessons.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned lessons
    **/
    _count?: true | LessonCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LessonAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LessonSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LessonMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LessonMaxAggregateInputType
  }

  export type GetLessonAggregateType<T extends LessonAggregateArgs> = {
        [P in keyof T & keyof AggregateLesson]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLesson[P]>
      : GetScalarType<T[P], AggregateLesson[P]>
  }




  export type lessonGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: lessonWhereInput
    orderBy?: lessonOrderByWithAggregationInput | lessonOrderByWithAggregationInput[]
    by: LessonScalarFieldEnum[] | LessonScalarFieldEnum
    having?: lessonScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LessonCountAggregateInputType | true
    _avg?: LessonAvgAggregateInputType
    _sum?: LessonSumAggregateInputType
    _min?: LessonMinAggregateInputType
    _max?: LessonMaxAggregateInputType
  }

  export type LessonGroupByOutputType = {
    id: bigint
    created_at: string | null
    name: string
    status: $Enums.lesson_status | null
    updated_at: string | null
    chapter_id: bigint | null
    _count: LessonCountAggregateOutputType | null
    _avg: LessonAvgAggregateOutputType | null
    _sum: LessonSumAggregateOutputType | null
    _min: LessonMinAggregateOutputType | null
    _max: LessonMaxAggregateOutputType | null
  }

  type GetLessonGroupByPayload<T extends lessonGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LessonGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LessonGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LessonGroupByOutputType[P]>
            : GetScalarType<T[P], LessonGroupByOutputType[P]>
        }
      >
    >


  export type lessonSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    created_at?: boolean
    name?: boolean
    status?: boolean
    updated_at?: boolean
    chapter_id?: boolean
    chapter?: boolean | lesson$chapterArgs<ExtArgs>
  }, ExtArgs["result"]["lesson"]>



  export type lessonSelectScalar = {
    id?: boolean
    created_at?: boolean
    name?: boolean
    status?: boolean
    updated_at?: boolean
    chapter_id?: boolean
  }

  export type lessonOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "created_at" | "name" | "status" | "updated_at" | "chapter_id", ExtArgs["result"]["lesson"]>
  export type lessonInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    chapter?: boolean | lesson$chapterArgs<ExtArgs>
  }

  export type $lessonPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "lesson"
    objects: {
      chapter: Prisma.$chapterPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      created_at: string | null
      name: string
      status: $Enums.lesson_status | null
      updated_at: string | null
      chapter_id: bigint | null
    }, ExtArgs["result"]["lesson"]>
    composites: {}
  }

  type lessonGetPayload<S extends boolean | null | undefined | lessonDefaultArgs> = $Result.GetResult<Prisma.$lessonPayload, S>

  type lessonCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<lessonFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LessonCountAggregateInputType | true
    }

  export interface lessonDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['lesson'], meta: { name: 'lesson' } }
    /**
     * Find zero or one Lesson that matches the filter.
     * @param {lessonFindUniqueArgs} args - Arguments to find a Lesson
     * @example
     * // Get one Lesson
     * const lesson = await prisma.lesson.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends lessonFindUniqueArgs>(args: SelectSubset<T, lessonFindUniqueArgs<ExtArgs>>): Prisma__lessonClient<$Result.GetResult<Prisma.$lessonPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Lesson that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {lessonFindUniqueOrThrowArgs} args - Arguments to find a Lesson
     * @example
     * // Get one Lesson
     * const lesson = await prisma.lesson.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends lessonFindUniqueOrThrowArgs>(args: SelectSubset<T, lessonFindUniqueOrThrowArgs<ExtArgs>>): Prisma__lessonClient<$Result.GetResult<Prisma.$lessonPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Lesson that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {lessonFindFirstArgs} args - Arguments to find a Lesson
     * @example
     * // Get one Lesson
     * const lesson = await prisma.lesson.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends lessonFindFirstArgs>(args?: SelectSubset<T, lessonFindFirstArgs<ExtArgs>>): Prisma__lessonClient<$Result.GetResult<Prisma.$lessonPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Lesson that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {lessonFindFirstOrThrowArgs} args - Arguments to find a Lesson
     * @example
     * // Get one Lesson
     * const lesson = await prisma.lesson.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends lessonFindFirstOrThrowArgs>(args?: SelectSubset<T, lessonFindFirstOrThrowArgs<ExtArgs>>): Prisma__lessonClient<$Result.GetResult<Prisma.$lessonPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Lessons that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {lessonFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Lessons
     * const lessons = await prisma.lesson.findMany()
     * 
     * // Get first 10 Lessons
     * const lessons = await prisma.lesson.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const lessonWithIdOnly = await prisma.lesson.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends lessonFindManyArgs>(args?: SelectSubset<T, lessonFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$lessonPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Lesson.
     * @param {lessonCreateArgs} args - Arguments to create a Lesson.
     * @example
     * // Create one Lesson
     * const Lesson = await prisma.lesson.create({
     *   data: {
     *     // ... data to create a Lesson
     *   }
     * })
     * 
     */
    create<T extends lessonCreateArgs>(args: SelectSubset<T, lessonCreateArgs<ExtArgs>>): Prisma__lessonClient<$Result.GetResult<Prisma.$lessonPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Lessons.
     * @param {lessonCreateManyArgs} args - Arguments to create many Lessons.
     * @example
     * // Create many Lessons
     * const lesson = await prisma.lesson.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends lessonCreateManyArgs>(args?: SelectSubset<T, lessonCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Lesson.
     * @param {lessonDeleteArgs} args - Arguments to delete one Lesson.
     * @example
     * // Delete one Lesson
     * const Lesson = await prisma.lesson.delete({
     *   where: {
     *     // ... filter to delete one Lesson
     *   }
     * })
     * 
     */
    delete<T extends lessonDeleteArgs>(args: SelectSubset<T, lessonDeleteArgs<ExtArgs>>): Prisma__lessonClient<$Result.GetResult<Prisma.$lessonPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Lesson.
     * @param {lessonUpdateArgs} args - Arguments to update one Lesson.
     * @example
     * // Update one Lesson
     * const lesson = await prisma.lesson.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends lessonUpdateArgs>(args: SelectSubset<T, lessonUpdateArgs<ExtArgs>>): Prisma__lessonClient<$Result.GetResult<Prisma.$lessonPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Lessons.
     * @param {lessonDeleteManyArgs} args - Arguments to filter Lessons to delete.
     * @example
     * // Delete a few Lessons
     * const { count } = await prisma.lesson.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends lessonDeleteManyArgs>(args?: SelectSubset<T, lessonDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Lessons.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {lessonUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Lessons
     * const lesson = await prisma.lesson.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends lessonUpdateManyArgs>(args: SelectSubset<T, lessonUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Lesson.
     * @param {lessonUpsertArgs} args - Arguments to update or create a Lesson.
     * @example
     * // Update or create a Lesson
     * const lesson = await prisma.lesson.upsert({
     *   create: {
     *     // ... data to create a Lesson
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Lesson we want to update
     *   }
     * })
     */
    upsert<T extends lessonUpsertArgs>(args: SelectSubset<T, lessonUpsertArgs<ExtArgs>>): Prisma__lessonClient<$Result.GetResult<Prisma.$lessonPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Lessons.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {lessonCountArgs} args - Arguments to filter Lessons to count.
     * @example
     * // Count the number of Lessons
     * const count = await prisma.lesson.count({
     *   where: {
     *     // ... the filter for the Lessons we want to count
     *   }
     * })
    **/
    count<T extends lessonCountArgs>(
      args?: Subset<T, lessonCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LessonCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Lesson.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LessonAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LessonAggregateArgs>(args: Subset<T, LessonAggregateArgs>): Prisma.PrismaPromise<GetLessonAggregateType<T>>

    /**
     * Group by Lesson.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {lessonGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends lessonGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: lessonGroupByArgs['orderBy'] }
        : { orderBy?: lessonGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, lessonGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLessonGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the lesson model
   */
  readonly fields: lessonFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for lesson.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__lessonClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    chapter<T extends lesson$chapterArgs<ExtArgs> = {}>(args?: Subset<T, lesson$chapterArgs<ExtArgs>>): Prisma__chapterClient<$Result.GetResult<Prisma.$chapterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the lesson model
   */
  interface lessonFieldRefs {
    readonly id: FieldRef<"lesson", 'BigInt'>
    readonly created_at: FieldRef<"lesson", 'String'>
    readonly name: FieldRef<"lesson", 'String'>
    readonly status: FieldRef<"lesson", 'lesson_status'>
    readonly updated_at: FieldRef<"lesson", 'String'>
    readonly chapter_id: FieldRef<"lesson", 'BigInt'>
  }
    

  // Custom InputTypes
  /**
   * lesson findUnique
   */
  export type lessonFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lesson
     */
    select?: lessonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the lesson
     */
    omit?: lessonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lessonInclude<ExtArgs> | null
    /**
     * Filter, which lesson to fetch.
     */
    where: lessonWhereUniqueInput
  }

  /**
   * lesson findUniqueOrThrow
   */
  export type lessonFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lesson
     */
    select?: lessonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the lesson
     */
    omit?: lessonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lessonInclude<ExtArgs> | null
    /**
     * Filter, which lesson to fetch.
     */
    where: lessonWhereUniqueInput
  }

  /**
   * lesson findFirst
   */
  export type lessonFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lesson
     */
    select?: lessonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the lesson
     */
    omit?: lessonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lessonInclude<ExtArgs> | null
    /**
     * Filter, which lesson to fetch.
     */
    where?: lessonWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of lessons to fetch.
     */
    orderBy?: lessonOrderByWithRelationInput | lessonOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for lessons.
     */
    cursor?: lessonWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` lessons from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` lessons.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of lessons.
     */
    distinct?: LessonScalarFieldEnum | LessonScalarFieldEnum[]
  }

  /**
   * lesson findFirstOrThrow
   */
  export type lessonFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lesson
     */
    select?: lessonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the lesson
     */
    omit?: lessonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lessonInclude<ExtArgs> | null
    /**
     * Filter, which lesson to fetch.
     */
    where?: lessonWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of lessons to fetch.
     */
    orderBy?: lessonOrderByWithRelationInput | lessonOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for lessons.
     */
    cursor?: lessonWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` lessons from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` lessons.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of lessons.
     */
    distinct?: LessonScalarFieldEnum | LessonScalarFieldEnum[]
  }

  /**
   * lesson findMany
   */
  export type lessonFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lesson
     */
    select?: lessonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the lesson
     */
    omit?: lessonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lessonInclude<ExtArgs> | null
    /**
     * Filter, which lessons to fetch.
     */
    where?: lessonWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of lessons to fetch.
     */
    orderBy?: lessonOrderByWithRelationInput | lessonOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing lessons.
     */
    cursor?: lessonWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` lessons from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` lessons.
     */
    skip?: number
    distinct?: LessonScalarFieldEnum | LessonScalarFieldEnum[]
  }

  /**
   * lesson create
   */
  export type lessonCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lesson
     */
    select?: lessonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the lesson
     */
    omit?: lessonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lessonInclude<ExtArgs> | null
    /**
     * The data needed to create a lesson.
     */
    data: XOR<lessonCreateInput, lessonUncheckedCreateInput>
  }

  /**
   * lesson createMany
   */
  export type lessonCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many lessons.
     */
    data: lessonCreateManyInput | lessonCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * lesson update
   */
  export type lessonUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lesson
     */
    select?: lessonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the lesson
     */
    omit?: lessonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lessonInclude<ExtArgs> | null
    /**
     * The data needed to update a lesson.
     */
    data: XOR<lessonUpdateInput, lessonUncheckedUpdateInput>
    /**
     * Choose, which lesson to update.
     */
    where: lessonWhereUniqueInput
  }

  /**
   * lesson updateMany
   */
  export type lessonUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update lessons.
     */
    data: XOR<lessonUpdateManyMutationInput, lessonUncheckedUpdateManyInput>
    /**
     * Filter which lessons to update
     */
    where?: lessonWhereInput
    /**
     * Limit how many lessons to update.
     */
    limit?: number
  }

  /**
   * lesson upsert
   */
  export type lessonUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lesson
     */
    select?: lessonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the lesson
     */
    omit?: lessonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lessonInclude<ExtArgs> | null
    /**
     * The filter to search for the lesson to update in case it exists.
     */
    where: lessonWhereUniqueInput
    /**
     * In case the lesson found by the `where` argument doesn't exist, create a new lesson with this data.
     */
    create: XOR<lessonCreateInput, lessonUncheckedCreateInput>
    /**
     * In case the lesson was found with the provided `where` argument, update it with this data.
     */
    update: XOR<lessonUpdateInput, lessonUncheckedUpdateInput>
  }

  /**
   * lesson delete
   */
  export type lessonDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lesson
     */
    select?: lessonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the lesson
     */
    omit?: lessonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lessonInclude<ExtArgs> | null
    /**
     * Filter which lesson to delete.
     */
    where: lessonWhereUniqueInput
  }

  /**
   * lesson deleteMany
   */
  export type lessonDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which lessons to delete
     */
    where?: lessonWhereInput
    /**
     * Limit how many lessons to delete.
     */
    limit?: number
  }

  /**
   * lesson.chapter
   */
  export type lesson$chapterArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chapter
     */
    select?: chapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the chapter
     */
    omit?: chapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: chapterInclude<ExtArgs> | null
    where?: chapterWhereInput
  }

  /**
   * lesson without action
   */
  export type lessonDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lesson
     */
    select?: lessonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the lesson
     */
    omit?: lessonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lessonInclude<ExtArgs> | null
  }


  /**
   * Model refresh_token
   */

  export type AggregateRefresh_token = {
    _count: Refresh_tokenCountAggregateOutputType | null
    _avg: Refresh_tokenAvgAggregateOutputType | null
    _sum: Refresh_tokenSumAggregateOutputType | null
    _min: Refresh_tokenMinAggregateOutputType | null
    _max: Refresh_tokenMaxAggregateOutputType | null
  }

  export type Refresh_tokenAvgAggregateOutputType = {
    id: number | null
  }

  export type Refresh_tokenSumAggregateOutputType = {
    id: bigint | null
  }

  export type Refresh_tokenMinAggregateOutputType = {
    id: bigint | null
    expires_at: Date | null
    is_revoked: boolean | null
    issued_at: Date | null
    token: string | null
    user_id: Uint8Array | null
  }

  export type Refresh_tokenMaxAggregateOutputType = {
    id: bigint | null
    expires_at: Date | null
    is_revoked: boolean | null
    issued_at: Date | null
    token: string | null
    user_id: Uint8Array | null
  }

  export type Refresh_tokenCountAggregateOutputType = {
    id: number
    expires_at: number
    is_revoked: number
    issued_at: number
    token: number
    user_id: number
    _all: number
  }


  export type Refresh_tokenAvgAggregateInputType = {
    id?: true
  }

  export type Refresh_tokenSumAggregateInputType = {
    id?: true
  }

  export type Refresh_tokenMinAggregateInputType = {
    id?: true
    expires_at?: true
    is_revoked?: true
    issued_at?: true
    token?: true
    user_id?: true
  }

  export type Refresh_tokenMaxAggregateInputType = {
    id?: true
    expires_at?: true
    is_revoked?: true
    issued_at?: true
    token?: true
    user_id?: true
  }

  export type Refresh_tokenCountAggregateInputType = {
    id?: true
    expires_at?: true
    is_revoked?: true
    issued_at?: true
    token?: true
    user_id?: true
    _all?: true
  }

  export type Refresh_tokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which refresh_token to aggregate.
     */
    where?: refresh_tokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of refresh_tokens to fetch.
     */
    orderBy?: refresh_tokenOrderByWithRelationInput | refresh_tokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: refresh_tokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` refresh_tokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` refresh_tokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned refresh_tokens
    **/
    _count?: true | Refresh_tokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Refresh_tokenAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Refresh_tokenSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Refresh_tokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Refresh_tokenMaxAggregateInputType
  }

  export type GetRefresh_tokenAggregateType<T extends Refresh_tokenAggregateArgs> = {
        [P in keyof T & keyof AggregateRefresh_token]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRefresh_token[P]>
      : GetScalarType<T[P], AggregateRefresh_token[P]>
  }




  export type refresh_tokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: refresh_tokenWhereInput
    orderBy?: refresh_tokenOrderByWithAggregationInput | refresh_tokenOrderByWithAggregationInput[]
    by: Refresh_tokenScalarFieldEnum[] | Refresh_tokenScalarFieldEnum
    having?: refresh_tokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Refresh_tokenCountAggregateInputType | true
    _avg?: Refresh_tokenAvgAggregateInputType
    _sum?: Refresh_tokenSumAggregateInputType
    _min?: Refresh_tokenMinAggregateInputType
    _max?: Refresh_tokenMaxAggregateInputType
  }

  export type Refresh_tokenGroupByOutputType = {
    id: bigint
    expires_at: Date | null
    is_revoked: boolean
    issued_at: Date | null
    token: string | null
    user_id: Uint8Array | null
    _count: Refresh_tokenCountAggregateOutputType | null
    _avg: Refresh_tokenAvgAggregateOutputType | null
    _sum: Refresh_tokenSumAggregateOutputType | null
    _min: Refresh_tokenMinAggregateOutputType | null
    _max: Refresh_tokenMaxAggregateOutputType | null
  }

  type GetRefresh_tokenGroupByPayload<T extends refresh_tokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Refresh_tokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Refresh_tokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Refresh_tokenGroupByOutputType[P]>
            : GetScalarType<T[P], Refresh_tokenGroupByOutputType[P]>
        }
      >
    >


  export type refresh_tokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    expires_at?: boolean
    is_revoked?: boolean
    issued_at?: boolean
    token?: boolean
    user_id?: boolean
    user?: boolean | refresh_token$userArgs<ExtArgs>
  }, ExtArgs["result"]["refresh_token"]>



  export type refresh_tokenSelectScalar = {
    id?: boolean
    expires_at?: boolean
    is_revoked?: boolean
    issued_at?: boolean
    token?: boolean
    user_id?: boolean
  }

  export type refresh_tokenOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "expires_at" | "is_revoked" | "issued_at" | "token" | "user_id", ExtArgs["result"]["refresh_token"]>
  export type refresh_tokenInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | refresh_token$userArgs<ExtArgs>
  }

  export type $refresh_tokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "refresh_token"
    objects: {
      user: Prisma.$userPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      expires_at: Date | null
      is_revoked: boolean
      issued_at: Date | null
      token: string | null
      user_id: Uint8Array | null
    }, ExtArgs["result"]["refresh_token"]>
    composites: {}
  }

  type refresh_tokenGetPayload<S extends boolean | null | undefined | refresh_tokenDefaultArgs> = $Result.GetResult<Prisma.$refresh_tokenPayload, S>

  type refresh_tokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<refresh_tokenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Refresh_tokenCountAggregateInputType | true
    }

  export interface refresh_tokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['refresh_token'], meta: { name: 'refresh_token' } }
    /**
     * Find zero or one Refresh_token that matches the filter.
     * @param {refresh_tokenFindUniqueArgs} args - Arguments to find a Refresh_token
     * @example
     * // Get one Refresh_token
     * const refresh_token = await prisma.refresh_token.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends refresh_tokenFindUniqueArgs>(args: SelectSubset<T, refresh_tokenFindUniqueArgs<ExtArgs>>): Prisma__refresh_tokenClient<$Result.GetResult<Prisma.$refresh_tokenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Refresh_token that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {refresh_tokenFindUniqueOrThrowArgs} args - Arguments to find a Refresh_token
     * @example
     * // Get one Refresh_token
     * const refresh_token = await prisma.refresh_token.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends refresh_tokenFindUniqueOrThrowArgs>(args: SelectSubset<T, refresh_tokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__refresh_tokenClient<$Result.GetResult<Prisma.$refresh_tokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Refresh_token that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {refresh_tokenFindFirstArgs} args - Arguments to find a Refresh_token
     * @example
     * // Get one Refresh_token
     * const refresh_token = await prisma.refresh_token.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends refresh_tokenFindFirstArgs>(args?: SelectSubset<T, refresh_tokenFindFirstArgs<ExtArgs>>): Prisma__refresh_tokenClient<$Result.GetResult<Prisma.$refresh_tokenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Refresh_token that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {refresh_tokenFindFirstOrThrowArgs} args - Arguments to find a Refresh_token
     * @example
     * // Get one Refresh_token
     * const refresh_token = await prisma.refresh_token.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends refresh_tokenFindFirstOrThrowArgs>(args?: SelectSubset<T, refresh_tokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__refresh_tokenClient<$Result.GetResult<Prisma.$refresh_tokenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Refresh_tokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {refresh_tokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Refresh_tokens
     * const refresh_tokens = await prisma.refresh_token.findMany()
     * 
     * // Get first 10 Refresh_tokens
     * const refresh_tokens = await prisma.refresh_token.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const refresh_tokenWithIdOnly = await prisma.refresh_token.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends refresh_tokenFindManyArgs>(args?: SelectSubset<T, refresh_tokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$refresh_tokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Refresh_token.
     * @param {refresh_tokenCreateArgs} args - Arguments to create a Refresh_token.
     * @example
     * // Create one Refresh_token
     * const Refresh_token = await prisma.refresh_token.create({
     *   data: {
     *     // ... data to create a Refresh_token
     *   }
     * })
     * 
     */
    create<T extends refresh_tokenCreateArgs>(args: SelectSubset<T, refresh_tokenCreateArgs<ExtArgs>>): Prisma__refresh_tokenClient<$Result.GetResult<Prisma.$refresh_tokenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Refresh_tokens.
     * @param {refresh_tokenCreateManyArgs} args - Arguments to create many Refresh_tokens.
     * @example
     * // Create many Refresh_tokens
     * const refresh_token = await prisma.refresh_token.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends refresh_tokenCreateManyArgs>(args?: SelectSubset<T, refresh_tokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Refresh_token.
     * @param {refresh_tokenDeleteArgs} args - Arguments to delete one Refresh_token.
     * @example
     * // Delete one Refresh_token
     * const Refresh_token = await prisma.refresh_token.delete({
     *   where: {
     *     // ... filter to delete one Refresh_token
     *   }
     * })
     * 
     */
    delete<T extends refresh_tokenDeleteArgs>(args: SelectSubset<T, refresh_tokenDeleteArgs<ExtArgs>>): Prisma__refresh_tokenClient<$Result.GetResult<Prisma.$refresh_tokenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Refresh_token.
     * @param {refresh_tokenUpdateArgs} args - Arguments to update one Refresh_token.
     * @example
     * // Update one Refresh_token
     * const refresh_token = await prisma.refresh_token.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends refresh_tokenUpdateArgs>(args: SelectSubset<T, refresh_tokenUpdateArgs<ExtArgs>>): Prisma__refresh_tokenClient<$Result.GetResult<Prisma.$refresh_tokenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Refresh_tokens.
     * @param {refresh_tokenDeleteManyArgs} args - Arguments to filter Refresh_tokens to delete.
     * @example
     * // Delete a few Refresh_tokens
     * const { count } = await prisma.refresh_token.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends refresh_tokenDeleteManyArgs>(args?: SelectSubset<T, refresh_tokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Refresh_tokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {refresh_tokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Refresh_tokens
     * const refresh_token = await prisma.refresh_token.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends refresh_tokenUpdateManyArgs>(args: SelectSubset<T, refresh_tokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Refresh_token.
     * @param {refresh_tokenUpsertArgs} args - Arguments to update or create a Refresh_token.
     * @example
     * // Update or create a Refresh_token
     * const refresh_token = await prisma.refresh_token.upsert({
     *   create: {
     *     // ... data to create a Refresh_token
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Refresh_token we want to update
     *   }
     * })
     */
    upsert<T extends refresh_tokenUpsertArgs>(args: SelectSubset<T, refresh_tokenUpsertArgs<ExtArgs>>): Prisma__refresh_tokenClient<$Result.GetResult<Prisma.$refresh_tokenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Refresh_tokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {refresh_tokenCountArgs} args - Arguments to filter Refresh_tokens to count.
     * @example
     * // Count the number of Refresh_tokens
     * const count = await prisma.refresh_token.count({
     *   where: {
     *     // ... the filter for the Refresh_tokens we want to count
     *   }
     * })
    **/
    count<T extends refresh_tokenCountArgs>(
      args?: Subset<T, refresh_tokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Refresh_tokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Refresh_token.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Refresh_tokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Refresh_tokenAggregateArgs>(args: Subset<T, Refresh_tokenAggregateArgs>): Prisma.PrismaPromise<GetRefresh_tokenAggregateType<T>>

    /**
     * Group by Refresh_token.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {refresh_tokenGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends refresh_tokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: refresh_tokenGroupByArgs['orderBy'] }
        : { orderBy?: refresh_tokenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, refresh_tokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRefresh_tokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the refresh_token model
   */
  readonly fields: refresh_tokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for refresh_token.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__refresh_tokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends refresh_token$userArgs<ExtArgs> = {}>(args?: Subset<T, refresh_token$userArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the refresh_token model
   */
  interface refresh_tokenFieldRefs {
    readonly id: FieldRef<"refresh_token", 'BigInt'>
    readonly expires_at: FieldRef<"refresh_token", 'DateTime'>
    readonly is_revoked: FieldRef<"refresh_token", 'Boolean'>
    readonly issued_at: FieldRef<"refresh_token", 'DateTime'>
    readonly token: FieldRef<"refresh_token", 'String'>
    readonly user_id: FieldRef<"refresh_token", 'Bytes'>
  }
    

  // Custom InputTypes
  /**
   * refresh_token findUnique
   */
  export type refresh_tokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the refresh_token
     */
    select?: refresh_tokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the refresh_token
     */
    omit?: refresh_tokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: refresh_tokenInclude<ExtArgs> | null
    /**
     * Filter, which refresh_token to fetch.
     */
    where: refresh_tokenWhereUniqueInput
  }

  /**
   * refresh_token findUniqueOrThrow
   */
  export type refresh_tokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the refresh_token
     */
    select?: refresh_tokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the refresh_token
     */
    omit?: refresh_tokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: refresh_tokenInclude<ExtArgs> | null
    /**
     * Filter, which refresh_token to fetch.
     */
    where: refresh_tokenWhereUniqueInput
  }

  /**
   * refresh_token findFirst
   */
  export type refresh_tokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the refresh_token
     */
    select?: refresh_tokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the refresh_token
     */
    omit?: refresh_tokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: refresh_tokenInclude<ExtArgs> | null
    /**
     * Filter, which refresh_token to fetch.
     */
    where?: refresh_tokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of refresh_tokens to fetch.
     */
    orderBy?: refresh_tokenOrderByWithRelationInput | refresh_tokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for refresh_tokens.
     */
    cursor?: refresh_tokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` refresh_tokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` refresh_tokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of refresh_tokens.
     */
    distinct?: Refresh_tokenScalarFieldEnum | Refresh_tokenScalarFieldEnum[]
  }

  /**
   * refresh_token findFirstOrThrow
   */
  export type refresh_tokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the refresh_token
     */
    select?: refresh_tokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the refresh_token
     */
    omit?: refresh_tokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: refresh_tokenInclude<ExtArgs> | null
    /**
     * Filter, which refresh_token to fetch.
     */
    where?: refresh_tokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of refresh_tokens to fetch.
     */
    orderBy?: refresh_tokenOrderByWithRelationInput | refresh_tokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for refresh_tokens.
     */
    cursor?: refresh_tokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` refresh_tokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` refresh_tokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of refresh_tokens.
     */
    distinct?: Refresh_tokenScalarFieldEnum | Refresh_tokenScalarFieldEnum[]
  }

  /**
   * refresh_token findMany
   */
  export type refresh_tokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the refresh_token
     */
    select?: refresh_tokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the refresh_token
     */
    omit?: refresh_tokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: refresh_tokenInclude<ExtArgs> | null
    /**
     * Filter, which refresh_tokens to fetch.
     */
    where?: refresh_tokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of refresh_tokens to fetch.
     */
    orderBy?: refresh_tokenOrderByWithRelationInput | refresh_tokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing refresh_tokens.
     */
    cursor?: refresh_tokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` refresh_tokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` refresh_tokens.
     */
    skip?: number
    distinct?: Refresh_tokenScalarFieldEnum | Refresh_tokenScalarFieldEnum[]
  }

  /**
   * refresh_token create
   */
  export type refresh_tokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the refresh_token
     */
    select?: refresh_tokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the refresh_token
     */
    omit?: refresh_tokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: refresh_tokenInclude<ExtArgs> | null
    /**
     * The data needed to create a refresh_token.
     */
    data: XOR<refresh_tokenCreateInput, refresh_tokenUncheckedCreateInput>
  }

  /**
   * refresh_token createMany
   */
  export type refresh_tokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many refresh_tokens.
     */
    data: refresh_tokenCreateManyInput | refresh_tokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * refresh_token update
   */
  export type refresh_tokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the refresh_token
     */
    select?: refresh_tokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the refresh_token
     */
    omit?: refresh_tokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: refresh_tokenInclude<ExtArgs> | null
    /**
     * The data needed to update a refresh_token.
     */
    data: XOR<refresh_tokenUpdateInput, refresh_tokenUncheckedUpdateInput>
    /**
     * Choose, which refresh_token to update.
     */
    where: refresh_tokenWhereUniqueInput
  }

  /**
   * refresh_token updateMany
   */
  export type refresh_tokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update refresh_tokens.
     */
    data: XOR<refresh_tokenUpdateManyMutationInput, refresh_tokenUncheckedUpdateManyInput>
    /**
     * Filter which refresh_tokens to update
     */
    where?: refresh_tokenWhereInput
    /**
     * Limit how many refresh_tokens to update.
     */
    limit?: number
  }

  /**
   * refresh_token upsert
   */
  export type refresh_tokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the refresh_token
     */
    select?: refresh_tokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the refresh_token
     */
    omit?: refresh_tokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: refresh_tokenInclude<ExtArgs> | null
    /**
     * The filter to search for the refresh_token to update in case it exists.
     */
    where: refresh_tokenWhereUniqueInput
    /**
     * In case the refresh_token found by the `where` argument doesn't exist, create a new refresh_token with this data.
     */
    create: XOR<refresh_tokenCreateInput, refresh_tokenUncheckedCreateInput>
    /**
     * In case the refresh_token was found with the provided `where` argument, update it with this data.
     */
    update: XOR<refresh_tokenUpdateInput, refresh_tokenUncheckedUpdateInput>
  }

  /**
   * refresh_token delete
   */
  export type refresh_tokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the refresh_token
     */
    select?: refresh_tokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the refresh_token
     */
    omit?: refresh_tokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: refresh_tokenInclude<ExtArgs> | null
    /**
     * Filter which refresh_token to delete.
     */
    where: refresh_tokenWhereUniqueInput
  }

  /**
   * refresh_token deleteMany
   */
  export type refresh_tokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which refresh_tokens to delete
     */
    where?: refresh_tokenWhereInput
    /**
     * Limit how many refresh_tokens to delete.
     */
    limit?: number
  }

  /**
   * refresh_token.user
   */
  export type refresh_token$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    where?: userWhereInput
  }

  /**
   * refresh_token without action
   */
  export type refresh_tokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the refresh_token
     */
    select?: refresh_tokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the refresh_token
     */
    omit?: refresh_tokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: refresh_tokenInclude<ExtArgs> | null
  }


  /**
   * Model subject
   */

  export type AggregateSubject = {
    _count: SubjectCountAggregateOutputType | null
    _avg: SubjectAvgAggregateOutputType | null
    _sum: SubjectSumAggregateOutputType | null
    _min: SubjectMinAggregateOutputType | null
    _max: SubjectMaxAggregateOutputType | null
  }

  export type SubjectAvgAggregateOutputType = {
    id: number | null
    grade_id: number | null
  }

  export type SubjectSumAggregateOutputType = {
    id: bigint | null
    grade_id: bigint | null
  }

  export type SubjectMinAggregateOutputType = {
    id: bigint | null
    created_at: string | null
    name: string | null
    status: $Enums.subject_status | null
    updated_at: string | null
    grade_id: bigint | null
  }

  export type SubjectMaxAggregateOutputType = {
    id: bigint | null
    created_at: string | null
    name: string | null
    status: $Enums.subject_status | null
    updated_at: string | null
    grade_id: bigint | null
  }

  export type SubjectCountAggregateOutputType = {
    id: number
    created_at: number
    name: number
    status: number
    updated_at: number
    grade_id: number
    _all: number
  }


  export type SubjectAvgAggregateInputType = {
    id?: true
    grade_id?: true
  }

  export type SubjectSumAggregateInputType = {
    id?: true
    grade_id?: true
  }

  export type SubjectMinAggregateInputType = {
    id?: true
    created_at?: true
    name?: true
    status?: true
    updated_at?: true
    grade_id?: true
  }

  export type SubjectMaxAggregateInputType = {
    id?: true
    created_at?: true
    name?: true
    status?: true
    updated_at?: true
    grade_id?: true
  }

  export type SubjectCountAggregateInputType = {
    id?: true
    created_at?: true
    name?: true
    status?: true
    updated_at?: true
    grade_id?: true
    _all?: true
  }

  export type SubjectAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which subject to aggregate.
     */
    where?: subjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of subjects to fetch.
     */
    orderBy?: subjectOrderByWithRelationInput | subjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: subjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` subjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` subjects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned subjects
    **/
    _count?: true | SubjectCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SubjectAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SubjectSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SubjectMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SubjectMaxAggregateInputType
  }

  export type GetSubjectAggregateType<T extends SubjectAggregateArgs> = {
        [P in keyof T & keyof AggregateSubject]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubject[P]>
      : GetScalarType<T[P], AggregateSubject[P]>
  }




  export type subjectGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: subjectWhereInput
    orderBy?: subjectOrderByWithAggregationInput | subjectOrderByWithAggregationInput[]
    by: SubjectScalarFieldEnum[] | SubjectScalarFieldEnum
    having?: subjectScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SubjectCountAggregateInputType | true
    _avg?: SubjectAvgAggregateInputType
    _sum?: SubjectSumAggregateInputType
    _min?: SubjectMinAggregateInputType
    _max?: SubjectMaxAggregateInputType
  }

  export type SubjectGroupByOutputType = {
    id: bigint
    created_at: string | null
    name: string
    status: $Enums.subject_status | null
    updated_at: string | null
    grade_id: bigint | null
    _count: SubjectCountAggregateOutputType | null
    _avg: SubjectAvgAggregateOutputType | null
    _sum: SubjectSumAggregateOutputType | null
    _min: SubjectMinAggregateOutputType | null
    _max: SubjectMaxAggregateOutputType | null
  }

  type GetSubjectGroupByPayload<T extends subjectGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SubjectGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SubjectGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SubjectGroupByOutputType[P]>
            : GetScalarType<T[P], SubjectGroupByOutputType[P]>
        }
      >
    >


  export type subjectSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    created_at?: boolean
    name?: boolean
    status?: boolean
    updated_at?: boolean
    grade_id?: boolean
    book?: boolean | subject$bookArgs<ExtArgs>
    grade?: boolean | subject$gradeArgs<ExtArgs>
    _count?: boolean | SubjectCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subject"]>



  export type subjectSelectScalar = {
    id?: boolean
    created_at?: boolean
    name?: boolean
    status?: boolean
    updated_at?: boolean
    grade_id?: boolean
  }

  export type subjectOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "created_at" | "name" | "status" | "updated_at" | "grade_id", ExtArgs["result"]["subject"]>
  export type subjectInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    book?: boolean | subject$bookArgs<ExtArgs>
    grade?: boolean | subject$gradeArgs<ExtArgs>
    _count?: boolean | SubjectCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $subjectPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "subject"
    objects: {
      book: Prisma.$bookPayload<ExtArgs>[]
      grade: Prisma.$gradePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      created_at: string | null
      name: string
      status: $Enums.subject_status | null
      updated_at: string | null
      grade_id: bigint | null
    }, ExtArgs["result"]["subject"]>
    composites: {}
  }

  type subjectGetPayload<S extends boolean | null | undefined | subjectDefaultArgs> = $Result.GetResult<Prisma.$subjectPayload, S>

  type subjectCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<subjectFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SubjectCountAggregateInputType | true
    }

  export interface subjectDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['subject'], meta: { name: 'subject' } }
    /**
     * Find zero or one Subject that matches the filter.
     * @param {subjectFindUniqueArgs} args - Arguments to find a Subject
     * @example
     * // Get one Subject
     * const subject = await prisma.subject.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends subjectFindUniqueArgs>(args: SelectSubset<T, subjectFindUniqueArgs<ExtArgs>>): Prisma__subjectClient<$Result.GetResult<Prisma.$subjectPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Subject that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {subjectFindUniqueOrThrowArgs} args - Arguments to find a Subject
     * @example
     * // Get one Subject
     * const subject = await prisma.subject.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends subjectFindUniqueOrThrowArgs>(args: SelectSubset<T, subjectFindUniqueOrThrowArgs<ExtArgs>>): Prisma__subjectClient<$Result.GetResult<Prisma.$subjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Subject that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {subjectFindFirstArgs} args - Arguments to find a Subject
     * @example
     * // Get one Subject
     * const subject = await prisma.subject.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends subjectFindFirstArgs>(args?: SelectSubset<T, subjectFindFirstArgs<ExtArgs>>): Prisma__subjectClient<$Result.GetResult<Prisma.$subjectPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Subject that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {subjectFindFirstOrThrowArgs} args - Arguments to find a Subject
     * @example
     * // Get one Subject
     * const subject = await prisma.subject.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends subjectFindFirstOrThrowArgs>(args?: SelectSubset<T, subjectFindFirstOrThrowArgs<ExtArgs>>): Prisma__subjectClient<$Result.GetResult<Prisma.$subjectPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Subjects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {subjectFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Subjects
     * const subjects = await prisma.subject.findMany()
     * 
     * // Get first 10 Subjects
     * const subjects = await prisma.subject.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const subjectWithIdOnly = await prisma.subject.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends subjectFindManyArgs>(args?: SelectSubset<T, subjectFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$subjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Subject.
     * @param {subjectCreateArgs} args - Arguments to create a Subject.
     * @example
     * // Create one Subject
     * const Subject = await prisma.subject.create({
     *   data: {
     *     // ... data to create a Subject
     *   }
     * })
     * 
     */
    create<T extends subjectCreateArgs>(args: SelectSubset<T, subjectCreateArgs<ExtArgs>>): Prisma__subjectClient<$Result.GetResult<Prisma.$subjectPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Subjects.
     * @param {subjectCreateManyArgs} args - Arguments to create many Subjects.
     * @example
     * // Create many Subjects
     * const subject = await prisma.subject.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends subjectCreateManyArgs>(args?: SelectSubset<T, subjectCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Subject.
     * @param {subjectDeleteArgs} args - Arguments to delete one Subject.
     * @example
     * // Delete one Subject
     * const Subject = await prisma.subject.delete({
     *   where: {
     *     // ... filter to delete one Subject
     *   }
     * })
     * 
     */
    delete<T extends subjectDeleteArgs>(args: SelectSubset<T, subjectDeleteArgs<ExtArgs>>): Prisma__subjectClient<$Result.GetResult<Prisma.$subjectPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Subject.
     * @param {subjectUpdateArgs} args - Arguments to update one Subject.
     * @example
     * // Update one Subject
     * const subject = await prisma.subject.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends subjectUpdateArgs>(args: SelectSubset<T, subjectUpdateArgs<ExtArgs>>): Prisma__subjectClient<$Result.GetResult<Prisma.$subjectPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Subjects.
     * @param {subjectDeleteManyArgs} args - Arguments to filter Subjects to delete.
     * @example
     * // Delete a few Subjects
     * const { count } = await prisma.subject.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends subjectDeleteManyArgs>(args?: SelectSubset<T, subjectDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Subjects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {subjectUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Subjects
     * const subject = await prisma.subject.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends subjectUpdateManyArgs>(args: SelectSubset<T, subjectUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Subject.
     * @param {subjectUpsertArgs} args - Arguments to update or create a Subject.
     * @example
     * // Update or create a Subject
     * const subject = await prisma.subject.upsert({
     *   create: {
     *     // ... data to create a Subject
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Subject we want to update
     *   }
     * })
     */
    upsert<T extends subjectUpsertArgs>(args: SelectSubset<T, subjectUpsertArgs<ExtArgs>>): Prisma__subjectClient<$Result.GetResult<Prisma.$subjectPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Subjects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {subjectCountArgs} args - Arguments to filter Subjects to count.
     * @example
     * // Count the number of Subjects
     * const count = await prisma.subject.count({
     *   where: {
     *     // ... the filter for the Subjects we want to count
     *   }
     * })
    **/
    count<T extends subjectCountArgs>(
      args?: Subset<T, subjectCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SubjectCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Subject.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubjectAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SubjectAggregateArgs>(args: Subset<T, SubjectAggregateArgs>): Prisma.PrismaPromise<GetSubjectAggregateType<T>>

    /**
     * Group by Subject.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {subjectGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends subjectGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: subjectGroupByArgs['orderBy'] }
        : { orderBy?: subjectGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, subjectGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubjectGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the subject model
   */
  readonly fields: subjectFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for subject.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__subjectClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    book<T extends subject$bookArgs<ExtArgs> = {}>(args?: Subset<T, subject$bookArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$bookPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    grade<T extends subject$gradeArgs<ExtArgs> = {}>(args?: Subset<T, subject$gradeArgs<ExtArgs>>): Prisma__gradeClient<$Result.GetResult<Prisma.$gradePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the subject model
   */
  interface subjectFieldRefs {
    readonly id: FieldRef<"subject", 'BigInt'>
    readonly created_at: FieldRef<"subject", 'String'>
    readonly name: FieldRef<"subject", 'String'>
    readonly status: FieldRef<"subject", 'subject_status'>
    readonly updated_at: FieldRef<"subject", 'String'>
    readonly grade_id: FieldRef<"subject", 'BigInt'>
  }
    

  // Custom InputTypes
  /**
   * subject findUnique
   */
  export type subjectFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subject
     */
    select?: subjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subject
     */
    omit?: subjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: subjectInclude<ExtArgs> | null
    /**
     * Filter, which subject to fetch.
     */
    where: subjectWhereUniqueInput
  }

  /**
   * subject findUniqueOrThrow
   */
  export type subjectFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subject
     */
    select?: subjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subject
     */
    omit?: subjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: subjectInclude<ExtArgs> | null
    /**
     * Filter, which subject to fetch.
     */
    where: subjectWhereUniqueInput
  }

  /**
   * subject findFirst
   */
  export type subjectFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subject
     */
    select?: subjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subject
     */
    omit?: subjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: subjectInclude<ExtArgs> | null
    /**
     * Filter, which subject to fetch.
     */
    where?: subjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of subjects to fetch.
     */
    orderBy?: subjectOrderByWithRelationInput | subjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for subjects.
     */
    cursor?: subjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` subjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` subjects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of subjects.
     */
    distinct?: SubjectScalarFieldEnum | SubjectScalarFieldEnum[]
  }

  /**
   * subject findFirstOrThrow
   */
  export type subjectFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subject
     */
    select?: subjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subject
     */
    omit?: subjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: subjectInclude<ExtArgs> | null
    /**
     * Filter, which subject to fetch.
     */
    where?: subjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of subjects to fetch.
     */
    orderBy?: subjectOrderByWithRelationInput | subjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for subjects.
     */
    cursor?: subjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` subjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` subjects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of subjects.
     */
    distinct?: SubjectScalarFieldEnum | SubjectScalarFieldEnum[]
  }

  /**
   * subject findMany
   */
  export type subjectFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subject
     */
    select?: subjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subject
     */
    omit?: subjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: subjectInclude<ExtArgs> | null
    /**
     * Filter, which subjects to fetch.
     */
    where?: subjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of subjects to fetch.
     */
    orderBy?: subjectOrderByWithRelationInput | subjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing subjects.
     */
    cursor?: subjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` subjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` subjects.
     */
    skip?: number
    distinct?: SubjectScalarFieldEnum | SubjectScalarFieldEnum[]
  }

  /**
   * subject create
   */
  export type subjectCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subject
     */
    select?: subjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subject
     */
    omit?: subjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: subjectInclude<ExtArgs> | null
    /**
     * The data needed to create a subject.
     */
    data: XOR<subjectCreateInput, subjectUncheckedCreateInput>
  }

  /**
   * subject createMany
   */
  export type subjectCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many subjects.
     */
    data: subjectCreateManyInput | subjectCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * subject update
   */
  export type subjectUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subject
     */
    select?: subjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subject
     */
    omit?: subjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: subjectInclude<ExtArgs> | null
    /**
     * The data needed to update a subject.
     */
    data: XOR<subjectUpdateInput, subjectUncheckedUpdateInput>
    /**
     * Choose, which subject to update.
     */
    where: subjectWhereUniqueInput
  }

  /**
   * subject updateMany
   */
  export type subjectUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update subjects.
     */
    data: XOR<subjectUpdateManyMutationInput, subjectUncheckedUpdateManyInput>
    /**
     * Filter which subjects to update
     */
    where?: subjectWhereInput
    /**
     * Limit how many subjects to update.
     */
    limit?: number
  }

  /**
   * subject upsert
   */
  export type subjectUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subject
     */
    select?: subjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subject
     */
    omit?: subjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: subjectInclude<ExtArgs> | null
    /**
     * The filter to search for the subject to update in case it exists.
     */
    where: subjectWhereUniqueInput
    /**
     * In case the subject found by the `where` argument doesn't exist, create a new subject with this data.
     */
    create: XOR<subjectCreateInput, subjectUncheckedCreateInput>
    /**
     * In case the subject was found with the provided `where` argument, update it with this data.
     */
    update: XOR<subjectUpdateInput, subjectUncheckedUpdateInput>
  }

  /**
   * subject delete
   */
  export type subjectDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subject
     */
    select?: subjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subject
     */
    omit?: subjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: subjectInclude<ExtArgs> | null
    /**
     * Filter which subject to delete.
     */
    where: subjectWhereUniqueInput
  }

  /**
   * subject deleteMany
   */
  export type subjectDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which subjects to delete
     */
    where?: subjectWhereInput
    /**
     * Limit how many subjects to delete.
     */
    limit?: number
  }

  /**
   * subject.book
   */
  export type subject$bookArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the book
     */
    select?: bookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the book
     */
    omit?: bookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookInclude<ExtArgs> | null
    where?: bookWhereInput
    orderBy?: bookOrderByWithRelationInput | bookOrderByWithRelationInput[]
    cursor?: bookWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BookScalarFieldEnum | BookScalarFieldEnum[]
  }

  /**
   * subject.grade
   */
  export type subject$gradeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the grade
     */
    select?: gradeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the grade
     */
    omit?: gradeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: gradeInclude<ExtArgs> | null
    where?: gradeWhereInput
  }

  /**
   * subject without action
   */
  export type subjectDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subject
     */
    select?: subjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subject
     */
    omit?: subjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: subjectInclude<ExtArgs> | null
  }


  /**
   * Model user
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: Uint8Array | null
    email: string | null
    full_name: string | null
    password: string | null
    role: $Enums.user_role | null
    username: string | null
  }

  export type UserMaxAggregateOutputType = {
    id: Uint8Array | null
    email: string | null
    full_name: string | null
    password: string | null
    role: $Enums.user_role | null
    username: string | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    full_name: number
    password: number
    role: number
    username: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    full_name?: true
    password?: true
    role?: true
    username?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    full_name?: true
    password?: true
    role?: true
    username?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    full_name?: true
    password?: true
    role?: true
    username?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which user to aggregate.
     */
    where?: userWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: userOrderByWithRelationInput | userOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: userWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type userGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: userWhereInput
    orderBy?: userOrderByWithAggregationInput | userOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: userScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: Uint8Array
    email: string | null
    full_name: string | null
    password: string | null
    role: $Enums.user_role | null
    username: string | null
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends userGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type userSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    full_name?: boolean
    password?: boolean
    role?: boolean
    username?: boolean
    refresh_token?: boolean | user$refresh_tokenArgs<ExtArgs>
    work_space?: boolean | user$work_spaceArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>



  export type userSelectScalar = {
    id?: boolean
    email?: boolean
    full_name?: boolean
    password?: boolean
    role?: boolean
    username?: boolean
  }

  export type userOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "full_name" | "password" | "role" | "username", ExtArgs["result"]["user"]>
  export type userInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    refresh_token?: boolean | user$refresh_tokenArgs<ExtArgs>
    work_space?: boolean | user$work_spaceArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $userPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "user"
    objects: {
      refresh_token: Prisma.$refresh_tokenPayload<ExtArgs>[]
      work_space: Prisma.$work_spacePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: Uint8Array
      email: string | null
      full_name: string | null
      password: string | null
      role: $Enums.user_role | null
      username: string | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type userGetPayload<S extends boolean | null | undefined | userDefaultArgs> = $Result.GetResult<Prisma.$userPayload, S>

  type userCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<userFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface userDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['user'], meta: { name: 'user' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {userFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends userFindUniqueArgs>(args: SelectSubset<T, userFindUniqueArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {userFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends userFindUniqueOrThrowArgs>(args: SelectSubset<T, userFindUniqueOrThrowArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends userFindFirstArgs>(args?: SelectSubset<T, userFindFirstArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends userFindFirstOrThrowArgs>(args?: SelectSubset<T, userFindFirstOrThrowArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends userFindManyArgs>(args?: SelectSubset<T, userFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {userCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends userCreateArgs>(args: SelectSubset<T, userCreateArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {userCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends userCreateManyArgs>(args?: SelectSubset<T, userCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a User.
     * @param {userDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends userDeleteArgs>(args: SelectSubset<T, userDeleteArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {userUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends userUpdateArgs>(args: SelectSubset<T, userUpdateArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {userDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends userDeleteManyArgs>(args?: SelectSubset<T, userDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends userUpdateManyArgs>(args: SelectSubset<T, userUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {userUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends userUpsertArgs>(args: SelectSubset<T, userUpsertArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends userCountArgs>(
      args?: Subset<T, userCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends userGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: userGroupByArgs['orderBy'] }
        : { orderBy?: userGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, userGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the user model
   */
  readonly fields: userFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for user.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__userClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    refresh_token<T extends user$refresh_tokenArgs<ExtArgs> = {}>(args?: Subset<T, user$refresh_tokenArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$refresh_tokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    work_space<T extends user$work_spaceArgs<ExtArgs> = {}>(args?: Subset<T, user$work_spaceArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$work_spacePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the user model
   */
  interface userFieldRefs {
    readonly id: FieldRef<"user", 'Bytes'>
    readonly email: FieldRef<"user", 'String'>
    readonly full_name: FieldRef<"user", 'String'>
    readonly password: FieldRef<"user", 'String'>
    readonly role: FieldRef<"user", 'user_role'>
    readonly username: FieldRef<"user", 'String'>
  }
    

  // Custom InputTypes
  /**
   * user findUnique
   */
  export type userFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * Filter, which user to fetch.
     */
    where: userWhereUniqueInput
  }

  /**
   * user findUniqueOrThrow
   */
  export type userFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * Filter, which user to fetch.
     */
    where: userWhereUniqueInput
  }

  /**
   * user findFirst
   */
  export type userFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * Filter, which user to fetch.
     */
    where?: userWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: userOrderByWithRelationInput | userOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for users.
     */
    cursor?: userWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * user findFirstOrThrow
   */
  export type userFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * Filter, which user to fetch.
     */
    where?: userWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: userOrderByWithRelationInput | userOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for users.
     */
    cursor?: userWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * user findMany
   */
  export type userFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where?: userWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: userOrderByWithRelationInput | userOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing users.
     */
    cursor?: userWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * user create
   */
  export type userCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * The data needed to create a user.
     */
    data: XOR<userCreateInput, userUncheckedCreateInput>
  }

  /**
   * user createMany
   */
  export type userCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many users.
     */
    data: userCreateManyInput | userCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * user update
   */
  export type userUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * The data needed to update a user.
     */
    data: XOR<userUpdateInput, userUncheckedUpdateInput>
    /**
     * Choose, which user to update.
     */
    where: userWhereUniqueInput
  }

  /**
   * user updateMany
   */
  export type userUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update users.
     */
    data: XOR<userUpdateManyMutationInput, userUncheckedUpdateManyInput>
    /**
     * Filter which users to update
     */
    where?: userWhereInput
    /**
     * Limit how many users to update.
     */
    limit?: number
  }

  /**
   * user upsert
   */
  export type userUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * The filter to search for the user to update in case it exists.
     */
    where: userWhereUniqueInput
    /**
     * In case the user found by the `where` argument doesn't exist, create a new user with this data.
     */
    create: XOR<userCreateInput, userUncheckedCreateInput>
    /**
     * In case the user was found with the provided `where` argument, update it with this data.
     */
    update: XOR<userUpdateInput, userUncheckedUpdateInput>
  }

  /**
   * user delete
   */
  export type userDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * Filter which user to delete.
     */
    where: userWhereUniqueInput
  }

  /**
   * user deleteMany
   */
  export type userDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which users to delete
     */
    where?: userWhereInput
    /**
     * Limit how many users to delete.
     */
    limit?: number
  }

  /**
   * user.refresh_token
   */
  export type user$refresh_tokenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the refresh_token
     */
    select?: refresh_tokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the refresh_token
     */
    omit?: refresh_tokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: refresh_tokenInclude<ExtArgs> | null
    where?: refresh_tokenWhereInput
    orderBy?: refresh_tokenOrderByWithRelationInput | refresh_tokenOrderByWithRelationInput[]
    cursor?: refresh_tokenWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Refresh_tokenScalarFieldEnum | Refresh_tokenScalarFieldEnum[]
  }

  /**
   * user.work_space
   */
  export type user$work_spaceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the work_space
     */
    select?: work_spaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the work_space
     */
    omit?: work_spaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: work_spaceInclude<ExtArgs> | null
    where?: work_spaceWhereInput
    orderBy?: work_spaceOrderByWithRelationInput | work_spaceOrderByWithRelationInput[]
    cursor?: work_spaceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Work_spaceScalarFieldEnum | Work_spaceScalarFieldEnum[]
  }

  /**
   * user without action
   */
  export type userDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
  }


  /**
   * Model work_space
   */

  export type AggregateWork_space = {
    _count: Work_spaceCountAggregateOutputType | null
    _min: Work_spaceMinAggregateOutputType | null
    _max: Work_spaceMaxAggregateOutputType | null
  }

  export type Work_spaceMinAggregateOutputType = {
    id: Uint8Array | null
    name: string | null
    academic_year_id: Uint8Array | null
    account_id: Uint8Array | null
  }

  export type Work_spaceMaxAggregateOutputType = {
    id: Uint8Array | null
    name: string | null
    academic_year_id: Uint8Array | null
    account_id: Uint8Array | null
  }

  export type Work_spaceCountAggregateOutputType = {
    id: number
    name: number
    academic_year_id: number
    account_id: number
    _all: number
  }


  export type Work_spaceMinAggregateInputType = {
    id?: true
    name?: true
    academic_year_id?: true
    account_id?: true
  }

  export type Work_spaceMaxAggregateInputType = {
    id?: true
    name?: true
    academic_year_id?: true
    account_id?: true
  }

  export type Work_spaceCountAggregateInputType = {
    id?: true
    name?: true
    academic_year_id?: true
    account_id?: true
    _all?: true
  }

  export type Work_spaceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which work_space to aggregate.
     */
    where?: work_spaceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of work_spaces to fetch.
     */
    orderBy?: work_spaceOrderByWithRelationInput | work_spaceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: work_spaceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` work_spaces from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` work_spaces.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned work_spaces
    **/
    _count?: true | Work_spaceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Work_spaceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Work_spaceMaxAggregateInputType
  }

  export type GetWork_spaceAggregateType<T extends Work_spaceAggregateArgs> = {
        [P in keyof T & keyof AggregateWork_space]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWork_space[P]>
      : GetScalarType<T[P], AggregateWork_space[P]>
  }




  export type work_spaceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: work_spaceWhereInput
    orderBy?: work_spaceOrderByWithAggregationInput | work_spaceOrderByWithAggregationInput[]
    by: Work_spaceScalarFieldEnum[] | Work_spaceScalarFieldEnum
    having?: work_spaceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Work_spaceCountAggregateInputType | true
    _min?: Work_spaceMinAggregateInputType
    _max?: Work_spaceMaxAggregateInputType
  }

  export type Work_spaceGroupByOutputType = {
    id: Uint8Array
    name: string | null
    academic_year_id: Uint8Array | null
    account_id: Uint8Array | null
    _count: Work_spaceCountAggregateOutputType | null
    _min: Work_spaceMinAggregateOutputType | null
    _max: Work_spaceMaxAggregateOutputType | null
  }

  type GetWork_spaceGroupByPayload<T extends work_spaceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Work_spaceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Work_spaceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Work_spaceGroupByOutputType[P]>
            : GetScalarType<T[P], Work_spaceGroupByOutputType[P]>
        }
      >
    >


  export type work_spaceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    academic_year_id?: boolean
    account_id?: boolean
    academic_year?: boolean | work_space$academic_yearArgs<ExtArgs>
    user?: boolean | work_space$userArgs<ExtArgs>
  }, ExtArgs["result"]["work_space"]>



  export type work_spaceSelectScalar = {
    id?: boolean
    name?: boolean
    academic_year_id?: boolean
    account_id?: boolean
  }

  export type work_spaceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "academic_year_id" | "account_id", ExtArgs["result"]["work_space"]>
  export type work_spaceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    academic_year?: boolean | work_space$academic_yearArgs<ExtArgs>
    user?: boolean | work_space$userArgs<ExtArgs>
  }

  export type $work_spacePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "work_space"
    objects: {
      academic_year: Prisma.$academic_yearPayload<ExtArgs> | null
      user: Prisma.$userPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: Uint8Array
      name: string | null
      academic_year_id: Uint8Array | null
      account_id: Uint8Array | null
    }, ExtArgs["result"]["work_space"]>
    composites: {}
  }

  type work_spaceGetPayload<S extends boolean | null | undefined | work_spaceDefaultArgs> = $Result.GetResult<Prisma.$work_spacePayload, S>

  type work_spaceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<work_spaceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Work_spaceCountAggregateInputType | true
    }

  export interface work_spaceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['work_space'], meta: { name: 'work_space' } }
    /**
     * Find zero or one Work_space that matches the filter.
     * @param {work_spaceFindUniqueArgs} args - Arguments to find a Work_space
     * @example
     * // Get one Work_space
     * const work_space = await prisma.work_space.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends work_spaceFindUniqueArgs>(args: SelectSubset<T, work_spaceFindUniqueArgs<ExtArgs>>): Prisma__work_spaceClient<$Result.GetResult<Prisma.$work_spacePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Work_space that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {work_spaceFindUniqueOrThrowArgs} args - Arguments to find a Work_space
     * @example
     * // Get one Work_space
     * const work_space = await prisma.work_space.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends work_spaceFindUniqueOrThrowArgs>(args: SelectSubset<T, work_spaceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__work_spaceClient<$Result.GetResult<Prisma.$work_spacePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Work_space that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {work_spaceFindFirstArgs} args - Arguments to find a Work_space
     * @example
     * // Get one Work_space
     * const work_space = await prisma.work_space.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends work_spaceFindFirstArgs>(args?: SelectSubset<T, work_spaceFindFirstArgs<ExtArgs>>): Prisma__work_spaceClient<$Result.GetResult<Prisma.$work_spacePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Work_space that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {work_spaceFindFirstOrThrowArgs} args - Arguments to find a Work_space
     * @example
     * // Get one Work_space
     * const work_space = await prisma.work_space.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends work_spaceFindFirstOrThrowArgs>(args?: SelectSubset<T, work_spaceFindFirstOrThrowArgs<ExtArgs>>): Prisma__work_spaceClient<$Result.GetResult<Prisma.$work_spacePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Work_spaces that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {work_spaceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Work_spaces
     * const work_spaces = await prisma.work_space.findMany()
     * 
     * // Get first 10 Work_spaces
     * const work_spaces = await prisma.work_space.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const work_spaceWithIdOnly = await prisma.work_space.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends work_spaceFindManyArgs>(args?: SelectSubset<T, work_spaceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$work_spacePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Work_space.
     * @param {work_spaceCreateArgs} args - Arguments to create a Work_space.
     * @example
     * // Create one Work_space
     * const Work_space = await prisma.work_space.create({
     *   data: {
     *     // ... data to create a Work_space
     *   }
     * })
     * 
     */
    create<T extends work_spaceCreateArgs>(args: SelectSubset<T, work_spaceCreateArgs<ExtArgs>>): Prisma__work_spaceClient<$Result.GetResult<Prisma.$work_spacePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Work_spaces.
     * @param {work_spaceCreateManyArgs} args - Arguments to create many Work_spaces.
     * @example
     * // Create many Work_spaces
     * const work_space = await prisma.work_space.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends work_spaceCreateManyArgs>(args?: SelectSubset<T, work_spaceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Work_space.
     * @param {work_spaceDeleteArgs} args - Arguments to delete one Work_space.
     * @example
     * // Delete one Work_space
     * const Work_space = await prisma.work_space.delete({
     *   where: {
     *     // ... filter to delete one Work_space
     *   }
     * })
     * 
     */
    delete<T extends work_spaceDeleteArgs>(args: SelectSubset<T, work_spaceDeleteArgs<ExtArgs>>): Prisma__work_spaceClient<$Result.GetResult<Prisma.$work_spacePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Work_space.
     * @param {work_spaceUpdateArgs} args - Arguments to update one Work_space.
     * @example
     * // Update one Work_space
     * const work_space = await prisma.work_space.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends work_spaceUpdateArgs>(args: SelectSubset<T, work_spaceUpdateArgs<ExtArgs>>): Prisma__work_spaceClient<$Result.GetResult<Prisma.$work_spacePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Work_spaces.
     * @param {work_spaceDeleteManyArgs} args - Arguments to filter Work_spaces to delete.
     * @example
     * // Delete a few Work_spaces
     * const { count } = await prisma.work_space.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends work_spaceDeleteManyArgs>(args?: SelectSubset<T, work_spaceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Work_spaces.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {work_spaceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Work_spaces
     * const work_space = await prisma.work_space.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends work_spaceUpdateManyArgs>(args: SelectSubset<T, work_spaceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Work_space.
     * @param {work_spaceUpsertArgs} args - Arguments to update or create a Work_space.
     * @example
     * // Update or create a Work_space
     * const work_space = await prisma.work_space.upsert({
     *   create: {
     *     // ... data to create a Work_space
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Work_space we want to update
     *   }
     * })
     */
    upsert<T extends work_spaceUpsertArgs>(args: SelectSubset<T, work_spaceUpsertArgs<ExtArgs>>): Prisma__work_spaceClient<$Result.GetResult<Prisma.$work_spacePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Work_spaces.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {work_spaceCountArgs} args - Arguments to filter Work_spaces to count.
     * @example
     * // Count the number of Work_spaces
     * const count = await prisma.work_space.count({
     *   where: {
     *     // ... the filter for the Work_spaces we want to count
     *   }
     * })
    **/
    count<T extends work_spaceCountArgs>(
      args?: Subset<T, work_spaceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Work_spaceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Work_space.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Work_spaceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Work_spaceAggregateArgs>(args: Subset<T, Work_spaceAggregateArgs>): Prisma.PrismaPromise<GetWork_spaceAggregateType<T>>

    /**
     * Group by Work_space.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {work_spaceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends work_spaceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: work_spaceGroupByArgs['orderBy'] }
        : { orderBy?: work_spaceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, work_spaceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWork_spaceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the work_space model
   */
  readonly fields: work_spaceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for work_space.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__work_spaceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    academic_year<T extends work_space$academic_yearArgs<ExtArgs> = {}>(args?: Subset<T, work_space$academic_yearArgs<ExtArgs>>): Prisma__academic_yearClient<$Result.GetResult<Prisma.$academic_yearPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    user<T extends work_space$userArgs<ExtArgs> = {}>(args?: Subset<T, work_space$userArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the work_space model
   */
  interface work_spaceFieldRefs {
    readonly id: FieldRef<"work_space", 'Bytes'>
    readonly name: FieldRef<"work_space", 'String'>
    readonly academic_year_id: FieldRef<"work_space", 'Bytes'>
    readonly account_id: FieldRef<"work_space", 'Bytes'>
  }
    

  // Custom InputTypes
  /**
   * work_space findUnique
   */
  export type work_spaceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the work_space
     */
    select?: work_spaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the work_space
     */
    omit?: work_spaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: work_spaceInclude<ExtArgs> | null
    /**
     * Filter, which work_space to fetch.
     */
    where: work_spaceWhereUniqueInput
  }

  /**
   * work_space findUniqueOrThrow
   */
  export type work_spaceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the work_space
     */
    select?: work_spaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the work_space
     */
    omit?: work_spaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: work_spaceInclude<ExtArgs> | null
    /**
     * Filter, which work_space to fetch.
     */
    where: work_spaceWhereUniqueInput
  }

  /**
   * work_space findFirst
   */
  export type work_spaceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the work_space
     */
    select?: work_spaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the work_space
     */
    omit?: work_spaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: work_spaceInclude<ExtArgs> | null
    /**
     * Filter, which work_space to fetch.
     */
    where?: work_spaceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of work_spaces to fetch.
     */
    orderBy?: work_spaceOrderByWithRelationInput | work_spaceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for work_spaces.
     */
    cursor?: work_spaceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` work_spaces from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` work_spaces.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of work_spaces.
     */
    distinct?: Work_spaceScalarFieldEnum | Work_spaceScalarFieldEnum[]
  }

  /**
   * work_space findFirstOrThrow
   */
  export type work_spaceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the work_space
     */
    select?: work_spaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the work_space
     */
    omit?: work_spaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: work_spaceInclude<ExtArgs> | null
    /**
     * Filter, which work_space to fetch.
     */
    where?: work_spaceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of work_spaces to fetch.
     */
    orderBy?: work_spaceOrderByWithRelationInput | work_spaceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for work_spaces.
     */
    cursor?: work_spaceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` work_spaces from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` work_spaces.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of work_spaces.
     */
    distinct?: Work_spaceScalarFieldEnum | Work_spaceScalarFieldEnum[]
  }

  /**
   * work_space findMany
   */
  export type work_spaceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the work_space
     */
    select?: work_spaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the work_space
     */
    omit?: work_spaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: work_spaceInclude<ExtArgs> | null
    /**
     * Filter, which work_spaces to fetch.
     */
    where?: work_spaceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of work_spaces to fetch.
     */
    orderBy?: work_spaceOrderByWithRelationInput | work_spaceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing work_spaces.
     */
    cursor?: work_spaceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` work_spaces from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` work_spaces.
     */
    skip?: number
    distinct?: Work_spaceScalarFieldEnum | Work_spaceScalarFieldEnum[]
  }

  /**
   * work_space create
   */
  export type work_spaceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the work_space
     */
    select?: work_spaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the work_space
     */
    omit?: work_spaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: work_spaceInclude<ExtArgs> | null
    /**
     * The data needed to create a work_space.
     */
    data: XOR<work_spaceCreateInput, work_spaceUncheckedCreateInput>
  }

  /**
   * work_space createMany
   */
  export type work_spaceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many work_spaces.
     */
    data: work_spaceCreateManyInput | work_spaceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * work_space update
   */
  export type work_spaceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the work_space
     */
    select?: work_spaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the work_space
     */
    omit?: work_spaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: work_spaceInclude<ExtArgs> | null
    /**
     * The data needed to update a work_space.
     */
    data: XOR<work_spaceUpdateInput, work_spaceUncheckedUpdateInput>
    /**
     * Choose, which work_space to update.
     */
    where: work_spaceWhereUniqueInput
  }

  /**
   * work_space updateMany
   */
  export type work_spaceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update work_spaces.
     */
    data: XOR<work_spaceUpdateManyMutationInput, work_spaceUncheckedUpdateManyInput>
    /**
     * Filter which work_spaces to update
     */
    where?: work_spaceWhereInput
    /**
     * Limit how many work_spaces to update.
     */
    limit?: number
  }

  /**
   * work_space upsert
   */
  export type work_spaceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the work_space
     */
    select?: work_spaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the work_space
     */
    omit?: work_spaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: work_spaceInclude<ExtArgs> | null
    /**
     * The filter to search for the work_space to update in case it exists.
     */
    where: work_spaceWhereUniqueInput
    /**
     * In case the work_space found by the `where` argument doesn't exist, create a new work_space with this data.
     */
    create: XOR<work_spaceCreateInput, work_spaceUncheckedCreateInput>
    /**
     * In case the work_space was found with the provided `where` argument, update it with this data.
     */
    update: XOR<work_spaceUpdateInput, work_spaceUncheckedUpdateInput>
  }

  /**
   * work_space delete
   */
  export type work_spaceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the work_space
     */
    select?: work_spaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the work_space
     */
    omit?: work_spaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: work_spaceInclude<ExtArgs> | null
    /**
     * Filter which work_space to delete.
     */
    where: work_spaceWhereUniqueInput
  }

  /**
   * work_space deleteMany
   */
  export type work_spaceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which work_spaces to delete
     */
    where?: work_spaceWhereInput
    /**
     * Limit how many work_spaces to delete.
     */
    limit?: number
  }

  /**
   * work_space.academic_year
   */
  export type work_space$academic_yearArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the academic_year
     */
    select?: academic_yearSelect<ExtArgs> | null
    /**
     * Omit specific fields from the academic_year
     */
    omit?: academic_yearOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: academic_yearInclude<ExtArgs> | null
    where?: academic_yearWhereInput
  }

  /**
   * work_space.user
   */
  export type work_space$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    where?: userWhereInput
  }

  /**
   * work_space without action
   */
  export type work_spaceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the work_space
     */
    select?: work_spaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the work_space
     */
    omit?: work_spaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: work_spaceInclude<ExtArgs> | null
  }


  /**
   * Model book_type
   */

  export type AggregateBook_type = {
    _count: Book_typeCountAggregateOutputType | null
    _avg: Book_typeAvgAggregateOutputType | null
    _sum: Book_typeSumAggregateOutputType | null
    _min: Book_typeMinAggregateOutputType | null
    _max: Book_typeMaxAggregateOutputType | null
  }

  export type Book_typeAvgAggregateOutputType = {
    token_cost_per_query: number | null
  }

  export type Book_typeSumAggregateOutputType = {
    token_cost_per_query: number | null
  }

  export type Book_typeMinAggregateOutputType = {
    id: Uint8Array | null
    created_at: string | null
    description: string | null
    icon: string | null
    name: string | null
    status: $Enums.book_type_status | null
    updated_at: string | null
    token_cost_per_query: number | null
  }

  export type Book_typeMaxAggregateOutputType = {
    id: Uint8Array | null
    created_at: string | null
    description: string | null
    icon: string | null
    name: string | null
    status: $Enums.book_type_status | null
    updated_at: string | null
    token_cost_per_query: number | null
  }

  export type Book_typeCountAggregateOutputType = {
    id: number
    created_at: number
    description: number
    icon: number
    name: number
    status: number
    updated_at: number
    token_cost_per_query: number
    _all: number
  }


  export type Book_typeAvgAggregateInputType = {
    token_cost_per_query?: true
  }

  export type Book_typeSumAggregateInputType = {
    token_cost_per_query?: true
  }

  export type Book_typeMinAggregateInputType = {
    id?: true
    created_at?: true
    description?: true
    icon?: true
    name?: true
    status?: true
    updated_at?: true
    token_cost_per_query?: true
  }

  export type Book_typeMaxAggregateInputType = {
    id?: true
    created_at?: true
    description?: true
    icon?: true
    name?: true
    status?: true
    updated_at?: true
    token_cost_per_query?: true
  }

  export type Book_typeCountAggregateInputType = {
    id?: true
    created_at?: true
    description?: true
    icon?: true
    name?: true
    status?: true
    updated_at?: true
    token_cost_per_query?: true
    _all?: true
  }

  export type Book_typeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which book_type to aggregate.
     */
    where?: book_typeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of book_types to fetch.
     */
    orderBy?: book_typeOrderByWithRelationInput | book_typeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: book_typeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` book_types from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` book_types.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned book_types
    **/
    _count?: true | Book_typeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Book_typeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Book_typeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Book_typeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Book_typeMaxAggregateInputType
  }

  export type GetBook_typeAggregateType<T extends Book_typeAggregateArgs> = {
        [P in keyof T & keyof AggregateBook_type]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBook_type[P]>
      : GetScalarType<T[P], AggregateBook_type[P]>
  }




  export type book_typeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: book_typeWhereInput
    orderBy?: book_typeOrderByWithAggregationInput | book_typeOrderByWithAggregationInput[]
    by: Book_typeScalarFieldEnum[] | Book_typeScalarFieldEnum
    having?: book_typeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Book_typeCountAggregateInputType | true
    _avg?: Book_typeAvgAggregateInputType
    _sum?: Book_typeSumAggregateInputType
    _min?: Book_typeMinAggregateInputType
    _max?: Book_typeMaxAggregateInputType
  }

  export type Book_typeGroupByOutputType = {
    id: Uint8Array
    created_at: string | null
    description: string | null
    icon: string | null
    name: string | null
    status: $Enums.book_type_status | null
    updated_at: string | null
    token_cost_per_query: number
    _count: Book_typeCountAggregateOutputType | null
    _avg: Book_typeAvgAggregateOutputType | null
    _sum: Book_typeSumAggregateOutputType | null
    _min: Book_typeMinAggregateOutputType | null
    _max: Book_typeMaxAggregateOutputType | null
  }

  type GetBook_typeGroupByPayload<T extends book_typeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Book_typeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Book_typeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Book_typeGroupByOutputType[P]>
            : GetScalarType<T[P], Book_typeGroupByOutputType[P]>
        }
      >
    >


  export type book_typeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    created_at?: boolean
    description?: boolean
    icon?: boolean
    name?: boolean
    status?: boolean
    updated_at?: boolean
    token_cost_per_query?: boolean
  }, ExtArgs["result"]["book_type"]>



  export type book_typeSelectScalar = {
    id?: boolean
    created_at?: boolean
    description?: boolean
    icon?: boolean
    name?: boolean
    status?: boolean
    updated_at?: boolean
    token_cost_per_query?: boolean
  }

  export type book_typeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "created_at" | "description" | "icon" | "name" | "status" | "updated_at" | "token_cost_per_query", ExtArgs["result"]["book_type"]>

  export type $book_typePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "book_type"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: Uint8Array
      created_at: string | null
      description: string | null
      icon: string | null
      name: string | null
      status: $Enums.book_type_status | null
      updated_at: string | null
      token_cost_per_query: number
    }, ExtArgs["result"]["book_type"]>
    composites: {}
  }

  type book_typeGetPayload<S extends boolean | null | undefined | book_typeDefaultArgs> = $Result.GetResult<Prisma.$book_typePayload, S>

  type book_typeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<book_typeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Book_typeCountAggregateInputType | true
    }

  export interface book_typeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['book_type'], meta: { name: 'book_type' } }
    /**
     * Find zero or one Book_type that matches the filter.
     * @param {book_typeFindUniqueArgs} args - Arguments to find a Book_type
     * @example
     * // Get one Book_type
     * const book_type = await prisma.book_type.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends book_typeFindUniqueArgs>(args: SelectSubset<T, book_typeFindUniqueArgs<ExtArgs>>): Prisma__book_typeClient<$Result.GetResult<Prisma.$book_typePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Book_type that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {book_typeFindUniqueOrThrowArgs} args - Arguments to find a Book_type
     * @example
     * // Get one Book_type
     * const book_type = await prisma.book_type.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends book_typeFindUniqueOrThrowArgs>(args: SelectSubset<T, book_typeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__book_typeClient<$Result.GetResult<Prisma.$book_typePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Book_type that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {book_typeFindFirstArgs} args - Arguments to find a Book_type
     * @example
     * // Get one Book_type
     * const book_type = await prisma.book_type.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends book_typeFindFirstArgs>(args?: SelectSubset<T, book_typeFindFirstArgs<ExtArgs>>): Prisma__book_typeClient<$Result.GetResult<Prisma.$book_typePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Book_type that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {book_typeFindFirstOrThrowArgs} args - Arguments to find a Book_type
     * @example
     * // Get one Book_type
     * const book_type = await prisma.book_type.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends book_typeFindFirstOrThrowArgs>(args?: SelectSubset<T, book_typeFindFirstOrThrowArgs<ExtArgs>>): Prisma__book_typeClient<$Result.GetResult<Prisma.$book_typePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Book_types that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {book_typeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Book_types
     * const book_types = await prisma.book_type.findMany()
     * 
     * // Get first 10 Book_types
     * const book_types = await prisma.book_type.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const book_typeWithIdOnly = await prisma.book_type.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends book_typeFindManyArgs>(args?: SelectSubset<T, book_typeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$book_typePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Book_type.
     * @param {book_typeCreateArgs} args - Arguments to create a Book_type.
     * @example
     * // Create one Book_type
     * const Book_type = await prisma.book_type.create({
     *   data: {
     *     // ... data to create a Book_type
     *   }
     * })
     * 
     */
    create<T extends book_typeCreateArgs>(args: SelectSubset<T, book_typeCreateArgs<ExtArgs>>): Prisma__book_typeClient<$Result.GetResult<Prisma.$book_typePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Book_types.
     * @param {book_typeCreateManyArgs} args - Arguments to create many Book_types.
     * @example
     * // Create many Book_types
     * const book_type = await prisma.book_type.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends book_typeCreateManyArgs>(args?: SelectSubset<T, book_typeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Book_type.
     * @param {book_typeDeleteArgs} args - Arguments to delete one Book_type.
     * @example
     * // Delete one Book_type
     * const Book_type = await prisma.book_type.delete({
     *   where: {
     *     // ... filter to delete one Book_type
     *   }
     * })
     * 
     */
    delete<T extends book_typeDeleteArgs>(args: SelectSubset<T, book_typeDeleteArgs<ExtArgs>>): Prisma__book_typeClient<$Result.GetResult<Prisma.$book_typePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Book_type.
     * @param {book_typeUpdateArgs} args - Arguments to update one Book_type.
     * @example
     * // Update one Book_type
     * const book_type = await prisma.book_type.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends book_typeUpdateArgs>(args: SelectSubset<T, book_typeUpdateArgs<ExtArgs>>): Prisma__book_typeClient<$Result.GetResult<Prisma.$book_typePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Book_types.
     * @param {book_typeDeleteManyArgs} args - Arguments to filter Book_types to delete.
     * @example
     * // Delete a few Book_types
     * const { count } = await prisma.book_type.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends book_typeDeleteManyArgs>(args?: SelectSubset<T, book_typeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Book_types.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {book_typeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Book_types
     * const book_type = await prisma.book_type.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends book_typeUpdateManyArgs>(args: SelectSubset<T, book_typeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Book_type.
     * @param {book_typeUpsertArgs} args - Arguments to update or create a Book_type.
     * @example
     * // Update or create a Book_type
     * const book_type = await prisma.book_type.upsert({
     *   create: {
     *     // ... data to create a Book_type
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Book_type we want to update
     *   }
     * })
     */
    upsert<T extends book_typeUpsertArgs>(args: SelectSubset<T, book_typeUpsertArgs<ExtArgs>>): Prisma__book_typeClient<$Result.GetResult<Prisma.$book_typePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Book_types.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {book_typeCountArgs} args - Arguments to filter Book_types to count.
     * @example
     * // Count the number of Book_types
     * const count = await prisma.book_type.count({
     *   where: {
     *     // ... the filter for the Book_types we want to count
     *   }
     * })
    **/
    count<T extends book_typeCountArgs>(
      args?: Subset<T, book_typeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Book_typeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Book_type.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Book_typeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Book_typeAggregateArgs>(args: Subset<T, Book_typeAggregateArgs>): Prisma.PrismaPromise<GetBook_typeAggregateType<T>>

    /**
     * Group by Book_type.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {book_typeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends book_typeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: book_typeGroupByArgs['orderBy'] }
        : { orderBy?: book_typeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, book_typeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBook_typeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the book_type model
   */
  readonly fields: book_typeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for book_type.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__book_typeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the book_type model
   */
  interface book_typeFieldRefs {
    readonly id: FieldRef<"book_type", 'Bytes'>
    readonly created_at: FieldRef<"book_type", 'String'>
    readonly description: FieldRef<"book_type", 'String'>
    readonly icon: FieldRef<"book_type", 'String'>
    readonly name: FieldRef<"book_type", 'String'>
    readonly status: FieldRef<"book_type", 'book_type_status'>
    readonly updated_at: FieldRef<"book_type", 'String'>
    readonly token_cost_per_query: FieldRef<"book_type", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * book_type findUnique
   */
  export type book_typeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the book_type
     */
    select?: book_typeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the book_type
     */
    omit?: book_typeOmit<ExtArgs> | null
    /**
     * Filter, which book_type to fetch.
     */
    where: book_typeWhereUniqueInput
  }

  /**
   * book_type findUniqueOrThrow
   */
  export type book_typeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the book_type
     */
    select?: book_typeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the book_type
     */
    omit?: book_typeOmit<ExtArgs> | null
    /**
     * Filter, which book_type to fetch.
     */
    where: book_typeWhereUniqueInput
  }

  /**
   * book_type findFirst
   */
  export type book_typeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the book_type
     */
    select?: book_typeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the book_type
     */
    omit?: book_typeOmit<ExtArgs> | null
    /**
     * Filter, which book_type to fetch.
     */
    where?: book_typeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of book_types to fetch.
     */
    orderBy?: book_typeOrderByWithRelationInput | book_typeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for book_types.
     */
    cursor?: book_typeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` book_types from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` book_types.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of book_types.
     */
    distinct?: Book_typeScalarFieldEnum | Book_typeScalarFieldEnum[]
  }

  /**
   * book_type findFirstOrThrow
   */
  export type book_typeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the book_type
     */
    select?: book_typeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the book_type
     */
    omit?: book_typeOmit<ExtArgs> | null
    /**
     * Filter, which book_type to fetch.
     */
    where?: book_typeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of book_types to fetch.
     */
    orderBy?: book_typeOrderByWithRelationInput | book_typeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for book_types.
     */
    cursor?: book_typeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` book_types from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` book_types.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of book_types.
     */
    distinct?: Book_typeScalarFieldEnum | Book_typeScalarFieldEnum[]
  }

  /**
   * book_type findMany
   */
  export type book_typeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the book_type
     */
    select?: book_typeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the book_type
     */
    omit?: book_typeOmit<ExtArgs> | null
    /**
     * Filter, which book_types to fetch.
     */
    where?: book_typeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of book_types to fetch.
     */
    orderBy?: book_typeOrderByWithRelationInput | book_typeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing book_types.
     */
    cursor?: book_typeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` book_types from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` book_types.
     */
    skip?: number
    distinct?: Book_typeScalarFieldEnum | Book_typeScalarFieldEnum[]
  }

  /**
   * book_type create
   */
  export type book_typeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the book_type
     */
    select?: book_typeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the book_type
     */
    omit?: book_typeOmit<ExtArgs> | null
    /**
     * The data needed to create a book_type.
     */
    data: XOR<book_typeCreateInput, book_typeUncheckedCreateInput>
  }

  /**
   * book_type createMany
   */
  export type book_typeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many book_types.
     */
    data: book_typeCreateManyInput | book_typeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * book_type update
   */
  export type book_typeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the book_type
     */
    select?: book_typeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the book_type
     */
    omit?: book_typeOmit<ExtArgs> | null
    /**
     * The data needed to update a book_type.
     */
    data: XOR<book_typeUpdateInput, book_typeUncheckedUpdateInput>
    /**
     * Choose, which book_type to update.
     */
    where: book_typeWhereUniqueInput
  }

  /**
   * book_type updateMany
   */
  export type book_typeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update book_types.
     */
    data: XOR<book_typeUpdateManyMutationInput, book_typeUncheckedUpdateManyInput>
    /**
     * Filter which book_types to update
     */
    where?: book_typeWhereInput
    /**
     * Limit how many book_types to update.
     */
    limit?: number
  }

  /**
   * book_type upsert
   */
  export type book_typeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the book_type
     */
    select?: book_typeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the book_type
     */
    omit?: book_typeOmit<ExtArgs> | null
    /**
     * The filter to search for the book_type to update in case it exists.
     */
    where: book_typeWhereUniqueInput
    /**
     * In case the book_type found by the `where` argument doesn't exist, create a new book_type with this data.
     */
    create: XOR<book_typeCreateInput, book_typeUncheckedCreateInput>
    /**
     * In case the book_type was found with the provided `where` argument, update it with this data.
     */
    update: XOR<book_typeUpdateInput, book_typeUncheckedUpdateInput>
  }

  /**
   * book_type delete
   */
  export type book_typeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the book_type
     */
    select?: book_typeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the book_type
     */
    omit?: book_typeOmit<ExtArgs> | null
    /**
     * Filter which book_type to delete.
     */
    where: book_typeWhereUniqueInput
  }

  /**
   * book_type deleteMany
   */
  export type book_typeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which book_types to delete
     */
    where?: book_typeWhereInput
    /**
     * Limit how many book_types to delete.
     */
    limit?: number
  }

  /**
   * book_type without action
   */
  export type book_typeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the book_type
     */
    select?: book_typeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the book_type
     */
    omit?: book_typeOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const Academic_yearScalarFieldEnum: {
    id: 'id',
    created_at: 'created_at',
    end_date: 'end_date',
    start_date: 'start_date',
    status: 'status',
    updated_at: 'updated_at',
    year_label: 'year_label'
  };

  export type Academic_yearScalarFieldEnum = (typeof Academic_yearScalarFieldEnum)[keyof typeof Academic_yearScalarFieldEnum]


  export const BookScalarFieldEnum: {
    id: 'id',
    created_at: 'created_at',
    name: 'name',
    status: 'status',
    updated_at: 'updated_at',
    subject_id: 'subject_id'
  };

  export type BookScalarFieldEnum = (typeof BookScalarFieldEnum)[keyof typeof BookScalarFieldEnum]


  export const ChapterScalarFieldEnum: {
    id: 'id',
    created_at: 'created_at',
    name: 'name',
    status: 'status',
    updated_at: 'updated_at',
    book_id: 'book_id'
  };

  export type ChapterScalarFieldEnum = (typeof ChapterScalarFieldEnum)[keyof typeof ChapterScalarFieldEnum]


  export const GradeScalarFieldEnum: {
    id: 'id',
    created_at: 'created_at',
    name: 'name',
    status: 'status',
    updated_at: 'updated_at'
  };

  export type GradeScalarFieldEnum = (typeof GradeScalarFieldEnum)[keyof typeof GradeScalarFieldEnum]


  export const LessonScalarFieldEnum: {
    id: 'id',
    created_at: 'created_at',
    name: 'name',
    status: 'status',
    updated_at: 'updated_at',
    chapter_id: 'chapter_id'
  };

  export type LessonScalarFieldEnum = (typeof LessonScalarFieldEnum)[keyof typeof LessonScalarFieldEnum]


  export const Refresh_tokenScalarFieldEnum: {
    id: 'id',
    expires_at: 'expires_at',
    is_revoked: 'is_revoked',
    issued_at: 'issued_at',
    token: 'token',
    user_id: 'user_id'
  };

  export type Refresh_tokenScalarFieldEnum = (typeof Refresh_tokenScalarFieldEnum)[keyof typeof Refresh_tokenScalarFieldEnum]


  export const SubjectScalarFieldEnum: {
    id: 'id',
    created_at: 'created_at',
    name: 'name',
    status: 'status',
    updated_at: 'updated_at',
    grade_id: 'grade_id'
  };

  export type SubjectScalarFieldEnum = (typeof SubjectScalarFieldEnum)[keyof typeof SubjectScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    full_name: 'full_name',
    password: 'password',
    role: 'role',
    username: 'username'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const Work_spaceScalarFieldEnum: {
    id: 'id',
    name: 'name',
    academic_year_id: 'academic_year_id',
    account_id: 'account_id'
  };

  export type Work_spaceScalarFieldEnum = (typeof Work_spaceScalarFieldEnum)[keyof typeof Work_spaceScalarFieldEnum]


  export const Book_typeScalarFieldEnum: {
    id: 'id',
    created_at: 'created_at',
    description: 'description',
    icon: 'icon',
    name: 'name',
    status: 'status',
    updated_at: 'updated_at',
    token_cost_per_query: 'token_cost_per_query'
  };

  export type Book_typeScalarFieldEnum = (typeof Book_typeScalarFieldEnum)[keyof typeof Book_typeScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const academic_yearOrderByRelevanceFieldEnum: {
    year_label: 'year_label'
  };

  export type academic_yearOrderByRelevanceFieldEnum = (typeof academic_yearOrderByRelevanceFieldEnum)[keyof typeof academic_yearOrderByRelevanceFieldEnum]


  export const bookOrderByRelevanceFieldEnum: {
    created_at: 'created_at',
    name: 'name',
    updated_at: 'updated_at'
  };

  export type bookOrderByRelevanceFieldEnum = (typeof bookOrderByRelevanceFieldEnum)[keyof typeof bookOrderByRelevanceFieldEnum]


  export const chapterOrderByRelevanceFieldEnum: {
    created_at: 'created_at',
    name: 'name',
    updated_at: 'updated_at'
  };

  export type chapterOrderByRelevanceFieldEnum = (typeof chapterOrderByRelevanceFieldEnum)[keyof typeof chapterOrderByRelevanceFieldEnum]


  export const gradeOrderByRelevanceFieldEnum: {
    created_at: 'created_at',
    name: 'name',
    updated_at: 'updated_at'
  };

  export type gradeOrderByRelevanceFieldEnum = (typeof gradeOrderByRelevanceFieldEnum)[keyof typeof gradeOrderByRelevanceFieldEnum]


  export const lessonOrderByRelevanceFieldEnum: {
    created_at: 'created_at',
    name: 'name',
    updated_at: 'updated_at'
  };

  export type lessonOrderByRelevanceFieldEnum = (typeof lessonOrderByRelevanceFieldEnum)[keyof typeof lessonOrderByRelevanceFieldEnum]


  export const refresh_tokenOrderByRelevanceFieldEnum: {
    token: 'token'
  };

  export type refresh_tokenOrderByRelevanceFieldEnum = (typeof refresh_tokenOrderByRelevanceFieldEnum)[keyof typeof refresh_tokenOrderByRelevanceFieldEnum]


  export const subjectOrderByRelevanceFieldEnum: {
    created_at: 'created_at',
    name: 'name',
    updated_at: 'updated_at'
  };

  export type subjectOrderByRelevanceFieldEnum = (typeof subjectOrderByRelevanceFieldEnum)[keyof typeof subjectOrderByRelevanceFieldEnum]


  export const userOrderByRelevanceFieldEnum: {
    email: 'email',
    full_name: 'full_name',
    password: 'password',
    username: 'username'
  };

  export type userOrderByRelevanceFieldEnum = (typeof userOrderByRelevanceFieldEnum)[keyof typeof userOrderByRelevanceFieldEnum]


  export const work_spaceOrderByRelevanceFieldEnum: {
    name: 'name'
  };

  export type work_spaceOrderByRelevanceFieldEnum = (typeof work_spaceOrderByRelevanceFieldEnum)[keyof typeof work_spaceOrderByRelevanceFieldEnum]


  export const book_typeOrderByRelevanceFieldEnum: {
    created_at: 'created_at',
    description: 'description',
    icon: 'icon',
    name: 'name',
    updated_at: 'updated_at'
  };

  export type book_typeOrderByRelevanceFieldEnum = (typeof book_typeOrderByRelevanceFieldEnum)[keyof typeof book_typeOrderByRelevanceFieldEnum]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Bytes'
   */
  export type BytesFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Bytes'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'academic_year_status'
   */
  export type Enumacademic_year_statusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'academic_year_status'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'book_status'
   */
  export type Enumbook_statusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'book_status'>
    


  /**
   * Reference to a field of type 'chapter_status'
   */
  export type Enumchapter_statusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'chapter_status'>
    


  /**
   * Reference to a field of type 'grade_status'
   */
  export type Enumgrade_statusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'grade_status'>
    


  /**
   * Reference to a field of type 'lesson_status'
   */
  export type Enumlesson_statusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'lesson_status'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'subject_status'
   */
  export type Enumsubject_statusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'subject_status'>
    


  /**
   * Reference to a field of type 'user_role'
   */
  export type Enumuser_roleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'user_role'>
    


  /**
   * Reference to a field of type 'book_type_status'
   */
  export type Enumbook_type_statusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'book_type_status'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type academic_yearWhereInput = {
    AND?: academic_yearWhereInput | academic_yearWhereInput[]
    OR?: academic_yearWhereInput[]
    NOT?: academic_yearWhereInput | academic_yearWhereInput[]
    id?: BytesFilter<"academic_year"> | Uint8Array
    created_at?: DateTimeNullableFilter<"academic_year"> | Date | string | null
    end_date?: DateTimeNullableFilter<"academic_year"> | Date | string | null
    start_date?: DateTimeNullableFilter<"academic_year"> | Date | string | null
    status?: Enumacademic_year_statusNullableFilter<"academic_year"> | $Enums.academic_year_status | null
    updated_at?: DateTimeNullableFilter<"academic_year"> | Date | string | null
    year_label?: StringNullableFilter<"academic_year"> | string | null
    work_space?: Work_spaceListRelationFilter
  }

  export type academic_yearOrderByWithRelationInput = {
    id?: SortOrder
    created_at?: SortOrderInput | SortOrder
    end_date?: SortOrderInput | SortOrder
    start_date?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    year_label?: SortOrderInput | SortOrder
    work_space?: work_spaceOrderByRelationAggregateInput
    _relevance?: academic_yearOrderByRelevanceInput
  }

  export type academic_yearWhereUniqueInput = Prisma.AtLeast<{
    id?: Uint8Array
    AND?: academic_yearWhereInput | academic_yearWhereInput[]
    OR?: academic_yearWhereInput[]
    NOT?: academic_yearWhereInput | academic_yearWhereInput[]
    created_at?: DateTimeNullableFilter<"academic_year"> | Date | string | null
    end_date?: DateTimeNullableFilter<"academic_year"> | Date | string | null
    start_date?: DateTimeNullableFilter<"academic_year"> | Date | string | null
    status?: Enumacademic_year_statusNullableFilter<"academic_year"> | $Enums.academic_year_status | null
    updated_at?: DateTimeNullableFilter<"academic_year"> | Date | string | null
    year_label?: StringNullableFilter<"academic_year"> | string | null
    work_space?: Work_spaceListRelationFilter
  }, "id">

  export type academic_yearOrderByWithAggregationInput = {
    id?: SortOrder
    created_at?: SortOrderInput | SortOrder
    end_date?: SortOrderInput | SortOrder
    start_date?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    year_label?: SortOrderInput | SortOrder
    _count?: academic_yearCountOrderByAggregateInput
    _max?: academic_yearMaxOrderByAggregateInput
    _min?: academic_yearMinOrderByAggregateInput
  }

  export type academic_yearScalarWhereWithAggregatesInput = {
    AND?: academic_yearScalarWhereWithAggregatesInput | academic_yearScalarWhereWithAggregatesInput[]
    OR?: academic_yearScalarWhereWithAggregatesInput[]
    NOT?: academic_yearScalarWhereWithAggregatesInput | academic_yearScalarWhereWithAggregatesInput[]
    id?: BytesWithAggregatesFilter<"academic_year"> | Uint8Array
    created_at?: DateTimeNullableWithAggregatesFilter<"academic_year"> | Date | string | null
    end_date?: DateTimeNullableWithAggregatesFilter<"academic_year"> | Date | string | null
    start_date?: DateTimeNullableWithAggregatesFilter<"academic_year"> | Date | string | null
    status?: Enumacademic_year_statusNullableWithAggregatesFilter<"academic_year"> | $Enums.academic_year_status | null
    updated_at?: DateTimeNullableWithAggregatesFilter<"academic_year"> | Date | string | null
    year_label?: StringNullableWithAggregatesFilter<"academic_year"> | string | null
  }

  export type bookWhereInput = {
    AND?: bookWhereInput | bookWhereInput[]
    OR?: bookWhereInput[]
    NOT?: bookWhereInput | bookWhereInput[]
    id?: BigIntFilter<"book"> | bigint | number
    created_at?: StringNullableFilter<"book"> | string | null
    name?: StringFilter<"book"> | string
    status?: Enumbook_statusNullableFilter<"book"> | $Enums.book_status | null
    updated_at?: StringNullableFilter<"book"> | string | null
    subject_id?: BigIntNullableFilter<"book"> | bigint | number | null
    subject?: XOR<SubjectNullableScalarRelationFilter, subjectWhereInput> | null
    chapter?: ChapterListRelationFilter
  }

  export type bookOrderByWithRelationInput = {
    id?: SortOrder
    created_at?: SortOrderInput | SortOrder
    name?: SortOrder
    status?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    subject_id?: SortOrderInput | SortOrder
    subject?: subjectOrderByWithRelationInput
    chapter?: chapterOrderByRelationAggregateInput
    _relevance?: bookOrderByRelevanceInput
  }

  export type bookWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: bookWhereInput | bookWhereInput[]
    OR?: bookWhereInput[]
    NOT?: bookWhereInput | bookWhereInput[]
    created_at?: StringNullableFilter<"book"> | string | null
    name?: StringFilter<"book"> | string
    status?: Enumbook_statusNullableFilter<"book"> | $Enums.book_status | null
    updated_at?: StringNullableFilter<"book"> | string | null
    subject_id?: BigIntNullableFilter<"book"> | bigint | number | null
    subject?: XOR<SubjectNullableScalarRelationFilter, subjectWhereInput> | null
    chapter?: ChapterListRelationFilter
  }, "id">

  export type bookOrderByWithAggregationInput = {
    id?: SortOrder
    created_at?: SortOrderInput | SortOrder
    name?: SortOrder
    status?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    subject_id?: SortOrderInput | SortOrder
    _count?: bookCountOrderByAggregateInput
    _avg?: bookAvgOrderByAggregateInput
    _max?: bookMaxOrderByAggregateInput
    _min?: bookMinOrderByAggregateInput
    _sum?: bookSumOrderByAggregateInput
  }

  export type bookScalarWhereWithAggregatesInput = {
    AND?: bookScalarWhereWithAggregatesInput | bookScalarWhereWithAggregatesInput[]
    OR?: bookScalarWhereWithAggregatesInput[]
    NOT?: bookScalarWhereWithAggregatesInput | bookScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"book"> | bigint | number
    created_at?: StringNullableWithAggregatesFilter<"book"> | string | null
    name?: StringWithAggregatesFilter<"book"> | string
    status?: Enumbook_statusNullableWithAggregatesFilter<"book"> | $Enums.book_status | null
    updated_at?: StringNullableWithAggregatesFilter<"book"> | string | null
    subject_id?: BigIntNullableWithAggregatesFilter<"book"> | bigint | number | null
  }

  export type chapterWhereInput = {
    AND?: chapterWhereInput | chapterWhereInput[]
    OR?: chapterWhereInput[]
    NOT?: chapterWhereInput | chapterWhereInput[]
    id?: BigIntFilter<"chapter"> | bigint | number
    created_at?: StringNullableFilter<"chapter"> | string | null
    name?: StringFilter<"chapter"> | string
    status?: Enumchapter_statusNullableFilter<"chapter"> | $Enums.chapter_status | null
    updated_at?: StringNullableFilter<"chapter"> | string | null
    book_id?: BigIntNullableFilter<"chapter"> | bigint | number | null
    book?: XOR<BookNullableScalarRelationFilter, bookWhereInput> | null
    lesson?: LessonListRelationFilter
  }

  export type chapterOrderByWithRelationInput = {
    id?: SortOrder
    created_at?: SortOrderInput | SortOrder
    name?: SortOrder
    status?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    book_id?: SortOrderInput | SortOrder
    book?: bookOrderByWithRelationInput
    lesson?: lessonOrderByRelationAggregateInput
    _relevance?: chapterOrderByRelevanceInput
  }

  export type chapterWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: chapterWhereInput | chapterWhereInput[]
    OR?: chapterWhereInput[]
    NOT?: chapterWhereInput | chapterWhereInput[]
    created_at?: StringNullableFilter<"chapter"> | string | null
    name?: StringFilter<"chapter"> | string
    status?: Enumchapter_statusNullableFilter<"chapter"> | $Enums.chapter_status | null
    updated_at?: StringNullableFilter<"chapter"> | string | null
    book_id?: BigIntNullableFilter<"chapter"> | bigint | number | null
    book?: XOR<BookNullableScalarRelationFilter, bookWhereInput> | null
    lesson?: LessonListRelationFilter
  }, "id">

  export type chapterOrderByWithAggregationInput = {
    id?: SortOrder
    created_at?: SortOrderInput | SortOrder
    name?: SortOrder
    status?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    book_id?: SortOrderInput | SortOrder
    _count?: chapterCountOrderByAggregateInput
    _avg?: chapterAvgOrderByAggregateInput
    _max?: chapterMaxOrderByAggregateInput
    _min?: chapterMinOrderByAggregateInput
    _sum?: chapterSumOrderByAggregateInput
  }

  export type chapterScalarWhereWithAggregatesInput = {
    AND?: chapterScalarWhereWithAggregatesInput | chapterScalarWhereWithAggregatesInput[]
    OR?: chapterScalarWhereWithAggregatesInput[]
    NOT?: chapterScalarWhereWithAggregatesInput | chapterScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"chapter"> | bigint | number
    created_at?: StringNullableWithAggregatesFilter<"chapter"> | string | null
    name?: StringWithAggregatesFilter<"chapter"> | string
    status?: Enumchapter_statusNullableWithAggregatesFilter<"chapter"> | $Enums.chapter_status | null
    updated_at?: StringNullableWithAggregatesFilter<"chapter"> | string | null
    book_id?: BigIntNullableWithAggregatesFilter<"chapter"> | bigint | number | null
  }

  export type gradeWhereInput = {
    AND?: gradeWhereInput | gradeWhereInput[]
    OR?: gradeWhereInput[]
    NOT?: gradeWhereInput | gradeWhereInput[]
    id?: BigIntFilter<"grade"> | bigint | number
    created_at?: StringNullableFilter<"grade"> | string | null
    name?: StringFilter<"grade"> | string
    status?: Enumgrade_statusNullableFilter<"grade"> | $Enums.grade_status | null
    updated_at?: StringNullableFilter<"grade"> | string | null
    subject?: SubjectListRelationFilter
  }

  export type gradeOrderByWithRelationInput = {
    id?: SortOrder
    created_at?: SortOrderInput | SortOrder
    name?: SortOrder
    status?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    subject?: subjectOrderByRelationAggregateInput
    _relevance?: gradeOrderByRelevanceInput
  }

  export type gradeWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    name?: string
    AND?: gradeWhereInput | gradeWhereInput[]
    OR?: gradeWhereInput[]
    NOT?: gradeWhereInput | gradeWhereInput[]
    created_at?: StringNullableFilter<"grade"> | string | null
    status?: Enumgrade_statusNullableFilter<"grade"> | $Enums.grade_status | null
    updated_at?: StringNullableFilter<"grade"> | string | null
    subject?: SubjectListRelationFilter
  }, "id" | "name">

  export type gradeOrderByWithAggregationInput = {
    id?: SortOrder
    created_at?: SortOrderInput | SortOrder
    name?: SortOrder
    status?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    _count?: gradeCountOrderByAggregateInput
    _avg?: gradeAvgOrderByAggregateInput
    _max?: gradeMaxOrderByAggregateInput
    _min?: gradeMinOrderByAggregateInput
    _sum?: gradeSumOrderByAggregateInput
  }

  export type gradeScalarWhereWithAggregatesInput = {
    AND?: gradeScalarWhereWithAggregatesInput | gradeScalarWhereWithAggregatesInput[]
    OR?: gradeScalarWhereWithAggregatesInput[]
    NOT?: gradeScalarWhereWithAggregatesInput | gradeScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"grade"> | bigint | number
    created_at?: StringNullableWithAggregatesFilter<"grade"> | string | null
    name?: StringWithAggregatesFilter<"grade"> | string
    status?: Enumgrade_statusNullableWithAggregatesFilter<"grade"> | $Enums.grade_status | null
    updated_at?: StringNullableWithAggregatesFilter<"grade"> | string | null
  }

  export type lessonWhereInput = {
    AND?: lessonWhereInput | lessonWhereInput[]
    OR?: lessonWhereInput[]
    NOT?: lessonWhereInput | lessonWhereInput[]
    id?: BigIntFilter<"lesson"> | bigint | number
    created_at?: StringNullableFilter<"lesson"> | string | null
    name?: StringFilter<"lesson"> | string
    status?: Enumlesson_statusNullableFilter<"lesson"> | $Enums.lesson_status | null
    updated_at?: StringNullableFilter<"lesson"> | string | null
    chapter_id?: BigIntNullableFilter<"lesson"> | bigint | number | null
    chapter?: XOR<ChapterNullableScalarRelationFilter, chapterWhereInput> | null
  }

  export type lessonOrderByWithRelationInput = {
    id?: SortOrder
    created_at?: SortOrderInput | SortOrder
    name?: SortOrder
    status?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    chapter_id?: SortOrderInput | SortOrder
    chapter?: chapterOrderByWithRelationInput
    _relevance?: lessonOrderByRelevanceInput
  }

  export type lessonWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: lessonWhereInput | lessonWhereInput[]
    OR?: lessonWhereInput[]
    NOT?: lessonWhereInput | lessonWhereInput[]
    created_at?: StringNullableFilter<"lesson"> | string | null
    name?: StringFilter<"lesson"> | string
    status?: Enumlesson_statusNullableFilter<"lesson"> | $Enums.lesson_status | null
    updated_at?: StringNullableFilter<"lesson"> | string | null
    chapter_id?: BigIntNullableFilter<"lesson"> | bigint | number | null
    chapter?: XOR<ChapterNullableScalarRelationFilter, chapterWhereInput> | null
  }, "id">

  export type lessonOrderByWithAggregationInput = {
    id?: SortOrder
    created_at?: SortOrderInput | SortOrder
    name?: SortOrder
    status?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    chapter_id?: SortOrderInput | SortOrder
    _count?: lessonCountOrderByAggregateInput
    _avg?: lessonAvgOrderByAggregateInput
    _max?: lessonMaxOrderByAggregateInput
    _min?: lessonMinOrderByAggregateInput
    _sum?: lessonSumOrderByAggregateInput
  }

  export type lessonScalarWhereWithAggregatesInput = {
    AND?: lessonScalarWhereWithAggregatesInput | lessonScalarWhereWithAggregatesInput[]
    OR?: lessonScalarWhereWithAggregatesInput[]
    NOT?: lessonScalarWhereWithAggregatesInput | lessonScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"lesson"> | bigint | number
    created_at?: StringNullableWithAggregatesFilter<"lesson"> | string | null
    name?: StringWithAggregatesFilter<"lesson"> | string
    status?: Enumlesson_statusNullableWithAggregatesFilter<"lesson"> | $Enums.lesson_status | null
    updated_at?: StringNullableWithAggregatesFilter<"lesson"> | string | null
    chapter_id?: BigIntNullableWithAggregatesFilter<"lesson"> | bigint | number | null
  }

  export type refresh_tokenWhereInput = {
    AND?: refresh_tokenWhereInput | refresh_tokenWhereInput[]
    OR?: refresh_tokenWhereInput[]
    NOT?: refresh_tokenWhereInput | refresh_tokenWhereInput[]
    id?: BigIntFilter<"refresh_token"> | bigint | number
    expires_at?: DateTimeNullableFilter<"refresh_token"> | Date | string | null
    is_revoked?: BoolFilter<"refresh_token"> | boolean
    issued_at?: DateTimeNullableFilter<"refresh_token"> | Date | string | null
    token?: StringNullableFilter<"refresh_token"> | string | null
    user_id?: BytesNullableFilter<"refresh_token"> | Uint8Array | null
    user?: XOR<UserNullableScalarRelationFilter, userWhereInput> | null
  }

  export type refresh_tokenOrderByWithRelationInput = {
    id?: SortOrder
    expires_at?: SortOrderInput | SortOrder
    is_revoked?: SortOrder
    issued_at?: SortOrderInput | SortOrder
    token?: SortOrderInput | SortOrder
    user_id?: SortOrderInput | SortOrder
    user?: userOrderByWithRelationInput
    _relevance?: refresh_tokenOrderByRelevanceInput
  }

  export type refresh_tokenWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: refresh_tokenWhereInput | refresh_tokenWhereInput[]
    OR?: refresh_tokenWhereInput[]
    NOT?: refresh_tokenWhereInput | refresh_tokenWhereInput[]
    expires_at?: DateTimeNullableFilter<"refresh_token"> | Date | string | null
    is_revoked?: BoolFilter<"refresh_token"> | boolean
    issued_at?: DateTimeNullableFilter<"refresh_token"> | Date | string | null
    token?: StringNullableFilter<"refresh_token"> | string | null
    user_id?: BytesNullableFilter<"refresh_token"> | Uint8Array | null
    user?: XOR<UserNullableScalarRelationFilter, userWhereInput> | null
  }, "id">

  export type refresh_tokenOrderByWithAggregationInput = {
    id?: SortOrder
    expires_at?: SortOrderInput | SortOrder
    is_revoked?: SortOrder
    issued_at?: SortOrderInput | SortOrder
    token?: SortOrderInput | SortOrder
    user_id?: SortOrderInput | SortOrder
    _count?: refresh_tokenCountOrderByAggregateInput
    _avg?: refresh_tokenAvgOrderByAggregateInput
    _max?: refresh_tokenMaxOrderByAggregateInput
    _min?: refresh_tokenMinOrderByAggregateInput
    _sum?: refresh_tokenSumOrderByAggregateInput
  }

  export type refresh_tokenScalarWhereWithAggregatesInput = {
    AND?: refresh_tokenScalarWhereWithAggregatesInput | refresh_tokenScalarWhereWithAggregatesInput[]
    OR?: refresh_tokenScalarWhereWithAggregatesInput[]
    NOT?: refresh_tokenScalarWhereWithAggregatesInput | refresh_tokenScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"refresh_token"> | bigint | number
    expires_at?: DateTimeNullableWithAggregatesFilter<"refresh_token"> | Date | string | null
    is_revoked?: BoolWithAggregatesFilter<"refresh_token"> | boolean
    issued_at?: DateTimeNullableWithAggregatesFilter<"refresh_token"> | Date | string | null
    token?: StringNullableWithAggregatesFilter<"refresh_token"> | string | null
    user_id?: BytesNullableWithAggregatesFilter<"refresh_token"> | Uint8Array | null
  }

  export type subjectWhereInput = {
    AND?: subjectWhereInput | subjectWhereInput[]
    OR?: subjectWhereInput[]
    NOT?: subjectWhereInput | subjectWhereInput[]
    id?: BigIntFilter<"subject"> | bigint | number
    created_at?: StringNullableFilter<"subject"> | string | null
    name?: StringFilter<"subject"> | string
    status?: Enumsubject_statusNullableFilter<"subject"> | $Enums.subject_status | null
    updated_at?: StringNullableFilter<"subject"> | string | null
    grade_id?: BigIntNullableFilter<"subject"> | bigint | number | null
    book?: BookListRelationFilter
    grade?: XOR<GradeNullableScalarRelationFilter, gradeWhereInput> | null
  }

  export type subjectOrderByWithRelationInput = {
    id?: SortOrder
    created_at?: SortOrderInput | SortOrder
    name?: SortOrder
    status?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    grade_id?: SortOrderInput | SortOrder
    book?: bookOrderByRelationAggregateInput
    grade?: gradeOrderByWithRelationInput
    _relevance?: subjectOrderByRelevanceInput
  }

  export type subjectWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: subjectWhereInput | subjectWhereInput[]
    OR?: subjectWhereInput[]
    NOT?: subjectWhereInput | subjectWhereInput[]
    created_at?: StringNullableFilter<"subject"> | string | null
    name?: StringFilter<"subject"> | string
    status?: Enumsubject_statusNullableFilter<"subject"> | $Enums.subject_status | null
    updated_at?: StringNullableFilter<"subject"> | string | null
    grade_id?: BigIntNullableFilter<"subject"> | bigint | number | null
    book?: BookListRelationFilter
    grade?: XOR<GradeNullableScalarRelationFilter, gradeWhereInput> | null
  }, "id">

  export type subjectOrderByWithAggregationInput = {
    id?: SortOrder
    created_at?: SortOrderInput | SortOrder
    name?: SortOrder
    status?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    grade_id?: SortOrderInput | SortOrder
    _count?: subjectCountOrderByAggregateInput
    _avg?: subjectAvgOrderByAggregateInput
    _max?: subjectMaxOrderByAggregateInput
    _min?: subjectMinOrderByAggregateInput
    _sum?: subjectSumOrderByAggregateInput
  }

  export type subjectScalarWhereWithAggregatesInput = {
    AND?: subjectScalarWhereWithAggregatesInput | subjectScalarWhereWithAggregatesInput[]
    OR?: subjectScalarWhereWithAggregatesInput[]
    NOT?: subjectScalarWhereWithAggregatesInput | subjectScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"subject"> | bigint | number
    created_at?: StringNullableWithAggregatesFilter<"subject"> | string | null
    name?: StringWithAggregatesFilter<"subject"> | string
    status?: Enumsubject_statusNullableWithAggregatesFilter<"subject"> | $Enums.subject_status | null
    updated_at?: StringNullableWithAggregatesFilter<"subject"> | string | null
    grade_id?: BigIntNullableWithAggregatesFilter<"subject"> | bigint | number | null
  }

  export type userWhereInput = {
    AND?: userWhereInput | userWhereInput[]
    OR?: userWhereInput[]
    NOT?: userWhereInput | userWhereInput[]
    id?: BytesFilter<"user"> | Uint8Array
    email?: StringNullableFilter<"user"> | string | null
    full_name?: StringNullableFilter<"user"> | string | null
    password?: StringNullableFilter<"user"> | string | null
    role?: Enumuser_roleNullableFilter<"user"> | $Enums.user_role | null
    username?: StringNullableFilter<"user"> | string | null
    refresh_token?: Refresh_tokenListRelationFilter
    work_space?: Work_spaceListRelationFilter
  }

  export type userOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrderInput | SortOrder
    full_name?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    role?: SortOrderInput | SortOrder
    username?: SortOrderInput | SortOrder
    refresh_token?: refresh_tokenOrderByRelationAggregateInput
    work_space?: work_spaceOrderByRelationAggregateInput
    _relevance?: userOrderByRelevanceInput
  }

  export type userWhereUniqueInput = Prisma.AtLeast<{
    id?: Uint8Array
    email?: string
    username?: string
    AND?: userWhereInput | userWhereInput[]
    OR?: userWhereInput[]
    NOT?: userWhereInput | userWhereInput[]
    full_name?: StringNullableFilter<"user"> | string | null
    password?: StringNullableFilter<"user"> | string | null
    role?: Enumuser_roleNullableFilter<"user"> | $Enums.user_role | null
    refresh_token?: Refresh_tokenListRelationFilter
    work_space?: Work_spaceListRelationFilter
  }, "id" | "email" | "username">

  export type userOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrderInput | SortOrder
    full_name?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    role?: SortOrderInput | SortOrder
    username?: SortOrderInput | SortOrder
    _count?: userCountOrderByAggregateInput
    _max?: userMaxOrderByAggregateInput
    _min?: userMinOrderByAggregateInput
  }

  export type userScalarWhereWithAggregatesInput = {
    AND?: userScalarWhereWithAggregatesInput | userScalarWhereWithAggregatesInput[]
    OR?: userScalarWhereWithAggregatesInput[]
    NOT?: userScalarWhereWithAggregatesInput | userScalarWhereWithAggregatesInput[]
    id?: BytesWithAggregatesFilter<"user"> | Uint8Array
    email?: StringNullableWithAggregatesFilter<"user"> | string | null
    full_name?: StringNullableWithAggregatesFilter<"user"> | string | null
    password?: StringNullableWithAggregatesFilter<"user"> | string | null
    role?: Enumuser_roleNullableWithAggregatesFilter<"user"> | $Enums.user_role | null
    username?: StringNullableWithAggregatesFilter<"user"> | string | null
  }

  export type work_spaceWhereInput = {
    AND?: work_spaceWhereInput | work_spaceWhereInput[]
    OR?: work_spaceWhereInput[]
    NOT?: work_spaceWhereInput | work_spaceWhereInput[]
    id?: BytesFilter<"work_space"> | Uint8Array
    name?: StringNullableFilter<"work_space"> | string | null
    academic_year_id?: BytesNullableFilter<"work_space"> | Uint8Array | null
    account_id?: BytesNullableFilter<"work_space"> | Uint8Array | null
    academic_year?: XOR<Academic_yearNullableScalarRelationFilter, academic_yearWhereInput> | null
    user?: XOR<UserNullableScalarRelationFilter, userWhereInput> | null
  }

  export type work_spaceOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    academic_year_id?: SortOrderInput | SortOrder
    account_id?: SortOrderInput | SortOrder
    academic_year?: academic_yearOrderByWithRelationInput
    user?: userOrderByWithRelationInput
    _relevance?: work_spaceOrderByRelevanceInput
  }

  export type work_spaceWhereUniqueInput = Prisma.AtLeast<{
    id?: Uint8Array
    AND?: work_spaceWhereInput | work_spaceWhereInput[]
    OR?: work_spaceWhereInput[]
    NOT?: work_spaceWhereInput | work_spaceWhereInput[]
    name?: StringNullableFilter<"work_space"> | string | null
    academic_year_id?: BytesNullableFilter<"work_space"> | Uint8Array | null
    account_id?: BytesNullableFilter<"work_space"> | Uint8Array | null
    academic_year?: XOR<Academic_yearNullableScalarRelationFilter, academic_yearWhereInput> | null
    user?: XOR<UserNullableScalarRelationFilter, userWhereInput> | null
  }, "id">

  export type work_spaceOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    academic_year_id?: SortOrderInput | SortOrder
    account_id?: SortOrderInput | SortOrder
    _count?: work_spaceCountOrderByAggregateInput
    _max?: work_spaceMaxOrderByAggregateInput
    _min?: work_spaceMinOrderByAggregateInput
  }

  export type work_spaceScalarWhereWithAggregatesInput = {
    AND?: work_spaceScalarWhereWithAggregatesInput | work_spaceScalarWhereWithAggregatesInput[]
    OR?: work_spaceScalarWhereWithAggregatesInput[]
    NOT?: work_spaceScalarWhereWithAggregatesInput | work_spaceScalarWhereWithAggregatesInput[]
    id?: BytesWithAggregatesFilter<"work_space"> | Uint8Array
    name?: StringNullableWithAggregatesFilter<"work_space"> | string | null
    academic_year_id?: BytesNullableWithAggregatesFilter<"work_space"> | Uint8Array | null
    account_id?: BytesNullableWithAggregatesFilter<"work_space"> | Uint8Array | null
  }

  export type book_typeWhereInput = {
    AND?: book_typeWhereInput | book_typeWhereInput[]
    OR?: book_typeWhereInput[]
    NOT?: book_typeWhereInput | book_typeWhereInput[]
    id?: BytesFilter<"book_type"> | Uint8Array
    created_at?: StringNullableFilter<"book_type"> | string | null
    description?: StringNullableFilter<"book_type"> | string | null
    icon?: StringNullableFilter<"book_type"> | string | null
    name?: StringNullableFilter<"book_type"> | string | null
    status?: Enumbook_type_statusNullableFilter<"book_type"> | $Enums.book_type_status | null
    updated_at?: StringNullableFilter<"book_type"> | string | null
    token_cost_per_query?: IntFilter<"book_type"> | number
  }

  export type book_typeOrderByWithRelationInput = {
    id?: SortOrder
    created_at?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    icon?: SortOrderInput | SortOrder
    name?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    token_cost_per_query?: SortOrder
    _relevance?: book_typeOrderByRelevanceInput
  }

  export type book_typeWhereUniqueInput = Prisma.AtLeast<{
    id?: Uint8Array
    AND?: book_typeWhereInput | book_typeWhereInput[]
    OR?: book_typeWhereInput[]
    NOT?: book_typeWhereInput | book_typeWhereInput[]
    created_at?: StringNullableFilter<"book_type"> | string | null
    description?: StringNullableFilter<"book_type"> | string | null
    icon?: StringNullableFilter<"book_type"> | string | null
    name?: StringNullableFilter<"book_type"> | string | null
    status?: Enumbook_type_statusNullableFilter<"book_type"> | $Enums.book_type_status | null
    updated_at?: StringNullableFilter<"book_type"> | string | null
    token_cost_per_query?: IntFilter<"book_type"> | number
  }, "id">

  export type book_typeOrderByWithAggregationInput = {
    id?: SortOrder
    created_at?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    icon?: SortOrderInput | SortOrder
    name?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    token_cost_per_query?: SortOrder
    _count?: book_typeCountOrderByAggregateInput
    _avg?: book_typeAvgOrderByAggregateInput
    _max?: book_typeMaxOrderByAggregateInput
    _min?: book_typeMinOrderByAggregateInput
    _sum?: book_typeSumOrderByAggregateInput
  }

  export type book_typeScalarWhereWithAggregatesInput = {
    AND?: book_typeScalarWhereWithAggregatesInput | book_typeScalarWhereWithAggregatesInput[]
    OR?: book_typeScalarWhereWithAggregatesInput[]
    NOT?: book_typeScalarWhereWithAggregatesInput | book_typeScalarWhereWithAggregatesInput[]
    id?: BytesWithAggregatesFilter<"book_type"> | Uint8Array
    created_at?: StringNullableWithAggregatesFilter<"book_type"> | string | null
    description?: StringNullableWithAggregatesFilter<"book_type"> | string | null
    icon?: StringNullableWithAggregatesFilter<"book_type"> | string | null
    name?: StringNullableWithAggregatesFilter<"book_type"> | string | null
    status?: Enumbook_type_statusNullableWithAggregatesFilter<"book_type"> | $Enums.book_type_status | null
    updated_at?: StringNullableWithAggregatesFilter<"book_type"> | string | null
    token_cost_per_query?: IntWithAggregatesFilter<"book_type"> | number
  }

  export type academic_yearCreateInput = {
    id: Uint8Array
    created_at?: Date | string | null
    end_date?: Date | string | null
    start_date?: Date | string | null
    status?: $Enums.academic_year_status | null
    updated_at?: Date | string | null
    year_label?: string | null
    work_space?: work_spaceCreateNestedManyWithoutAcademic_yearInput
  }

  export type academic_yearUncheckedCreateInput = {
    id: Uint8Array
    created_at?: Date | string | null
    end_date?: Date | string | null
    start_date?: Date | string | null
    status?: $Enums.academic_year_status | null
    updated_at?: Date | string | null
    year_label?: string | null
    work_space?: work_spaceUncheckedCreateNestedManyWithoutAcademic_yearInput
  }

  export type academic_yearUpdateInput = {
    id?: BytesFieldUpdateOperationsInput | Uint8Array
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: NullableEnumacademic_year_statusFieldUpdateOperationsInput | $Enums.academic_year_status | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    year_label?: NullableStringFieldUpdateOperationsInput | string | null
    work_space?: work_spaceUpdateManyWithoutAcademic_yearNestedInput
  }

  export type academic_yearUncheckedUpdateInput = {
    id?: BytesFieldUpdateOperationsInput | Uint8Array
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: NullableEnumacademic_year_statusFieldUpdateOperationsInput | $Enums.academic_year_status | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    year_label?: NullableStringFieldUpdateOperationsInput | string | null
    work_space?: work_spaceUncheckedUpdateManyWithoutAcademic_yearNestedInput
  }

  export type academic_yearCreateManyInput = {
    id: Uint8Array
    created_at?: Date | string | null
    end_date?: Date | string | null
    start_date?: Date | string | null
    status?: $Enums.academic_year_status | null
    updated_at?: Date | string | null
    year_label?: string | null
  }

  export type academic_yearUpdateManyMutationInput = {
    id?: BytesFieldUpdateOperationsInput | Uint8Array
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: NullableEnumacademic_year_statusFieldUpdateOperationsInput | $Enums.academic_year_status | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    year_label?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type academic_yearUncheckedUpdateManyInput = {
    id?: BytesFieldUpdateOperationsInput | Uint8Array
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: NullableEnumacademic_year_statusFieldUpdateOperationsInput | $Enums.academic_year_status | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    year_label?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type bookCreateInput = {
    id?: bigint | number
    created_at?: string | null
    name: string
    status?: $Enums.book_status | null
    updated_at?: string | null
    subject?: subjectCreateNestedOneWithoutBookInput
    chapter?: chapterCreateNestedManyWithoutBookInput
  }

  export type bookUncheckedCreateInput = {
    id?: bigint | number
    created_at?: string | null
    name: string
    status?: $Enums.book_status | null
    updated_at?: string | null
    subject_id?: bigint | number | null
    chapter?: chapterUncheckedCreateNestedManyWithoutBookInput
  }

  export type bookUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    status?: NullableEnumbook_statusFieldUpdateOperationsInput | $Enums.book_status | null
    updated_at?: NullableStringFieldUpdateOperationsInput | string | null
    subject?: subjectUpdateOneWithoutBookNestedInput
    chapter?: chapterUpdateManyWithoutBookNestedInput
  }

  export type bookUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    status?: NullableEnumbook_statusFieldUpdateOperationsInput | $Enums.book_status | null
    updated_at?: NullableStringFieldUpdateOperationsInput | string | null
    subject_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    chapter?: chapterUncheckedUpdateManyWithoutBookNestedInput
  }

  export type bookCreateManyInput = {
    id?: bigint | number
    created_at?: string | null
    name: string
    status?: $Enums.book_status | null
    updated_at?: string | null
    subject_id?: bigint | number | null
  }

  export type bookUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    status?: NullableEnumbook_statusFieldUpdateOperationsInput | $Enums.book_status | null
    updated_at?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type bookUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    status?: NullableEnumbook_statusFieldUpdateOperationsInput | $Enums.book_status | null
    updated_at?: NullableStringFieldUpdateOperationsInput | string | null
    subject_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type chapterCreateInput = {
    id?: bigint | number
    created_at?: string | null
    name: string
    status?: $Enums.chapter_status | null
    updated_at?: string | null
    book?: bookCreateNestedOneWithoutChapterInput
    lesson?: lessonCreateNestedManyWithoutChapterInput
  }

  export type chapterUncheckedCreateInput = {
    id?: bigint | number
    created_at?: string | null
    name: string
    status?: $Enums.chapter_status | null
    updated_at?: string | null
    book_id?: bigint | number | null
    lesson?: lessonUncheckedCreateNestedManyWithoutChapterInput
  }

  export type chapterUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    status?: NullableEnumchapter_statusFieldUpdateOperationsInput | $Enums.chapter_status | null
    updated_at?: NullableStringFieldUpdateOperationsInput | string | null
    book?: bookUpdateOneWithoutChapterNestedInput
    lesson?: lessonUpdateManyWithoutChapterNestedInput
  }

  export type chapterUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    status?: NullableEnumchapter_statusFieldUpdateOperationsInput | $Enums.chapter_status | null
    updated_at?: NullableStringFieldUpdateOperationsInput | string | null
    book_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    lesson?: lessonUncheckedUpdateManyWithoutChapterNestedInput
  }

  export type chapterCreateManyInput = {
    id?: bigint | number
    created_at?: string | null
    name: string
    status?: $Enums.chapter_status | null
    updated_at?: string | null
    book_id?: bigint | number | null
  }

  export type chapterUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    status?: NullableEnumchapter_statusFieldUpdateOperationsInput | $Enums.chapter_status | null
    updated_at?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type chapterUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    status?: NullableEnumchapter_statusFieldUpdateOperationsInput | $Enums.chapter_status | null
    updated_at?: NullableStringFieldUpdateOperationsInput | string | null
    book_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type gradeCreateInput = {
    id?: bigint | number
    created_at?: string | null
    name: string
    status?: $Enums.grade_status | null
    updated_at?: string | null
    subject?: subjectCreateNestedManyWithoutGradeInput
  }

  export type gradeUncheckedCreateInput = {
    id?: bigint | number
    created_at?: string | null
    name: string
    status?: $Enums.grade_status | null
    updated_at?: string | null
    subject?: subjectUncheckedCreateNestedManyWithoutGradeInput
  }

  export type gradeUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    status?: NullableEnumgrade_statusFieldUpdateOperationsInput | $Enums.grade_status | null
    updated_at?: NullableStringFieldUpdateOperationsInput | string | null
    subject?: subjectUpdateManyWithoutGradeNestedInput
  }

  export type gradeUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    status?: NullableEnumgrade_statusFieldUpdateOperationsInput | $Enums.grade_status | null
    updated_at?: NullableStringFieldUpdateOperationsInput | string | null
    subject?: subjectUncheckedUpdateManyWithoutGradeNestedInput
  }

  export type gradeCreateManyInput = {
    id?: bigint | number
    created_at?: string | null
    name: string
    status?: $Enums.grade_status | null
    updated_at?: string | null
  }

  export type gradeUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    status?: NullableEnumgrade_statusFieldUpdateOperationsInput | $Enums.grade_status | null
    updated_at?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type gradeUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    status?: NullableEnumgrade_statusFieldUpdateOperationsInput | $Enums.grade_status | null
    updated_at?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type lessonCreateInput = {
    id?: bigint | number
    created_at?: string | null
    name: string
    status?: $Enums.lesson_status | null
    updated_at?: string | null
    chapter?: chapterCreateNestedOneWithoutLessonInput
  }

  export type lessonUncheckedCreateInput = {
    id?: bigint | number
    created_at?: string | null
    name: string
    status?: $Enums.lesson_status | null
    updated_at?: string | null
    chapter_id?: bigint | number | null
  }

  export type lessonUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    status?: NullableEnumlesson_statusFieldUpdateOperationsInput | $Enums.lesson_status | null
    updated_at?: NullableStringFieldUpdateOperationsInput | string | null
    chapter?: chapterUpdateOneWithoutLessonNestedInput
  }

  export type lessonUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    status?: NullableEnumlesson_statusFieldUpdateOperationsInput | $Enums.lesson_status | null
    updated_at?: NullableStringFieldUpdateOperationsInput | string | null
    chapter_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type lessonCreateManyInput = {
    id?: bigint | number
    created_at?: string | null
    name: string
    status?: $Enums.lesson_status | null
    updated_at?: string | null
    chapter_id?: bigint | number | null
  }

  export type lessonUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    status?: NullableEnumlesson_statusFieldUpdateOperationsInput | $Enums.lesson_status | null
    updated_at?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type lessonUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    status?: NullableEnumlesson_statusFieldUpdateOperationsInput | $Enums.lesson_status | null
    updated_at?: NullableStringFieldUpdateOperationsInput | string | null
    chapter_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type refresh_tokenCreateInput = {
    id?: bigint | number
    expires_at?: Date | string | null
    is_revoked: boolean
    issued_at?: Date | string | null
    token?: string | null
    user?: userCreateNestedOneWithoutRefresh_tokenInput
  }

  export type refresh_tokenUncheckedCreateInput = {
    id?: bigint | number
    expires_at?: Date | string | null
    is_revoked: boolean
    issued_at?: Date | string | null
    token?: string | null
    user_id?: Uint8Array | null
  }

  export type refresh_tokenUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_revoked?: BoolFieldUpdateOperationsInput | boolean
    issued_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    token?: NullableStringFieldUpdateOperationsInput | string | null
    user?: userUpdateOneWithoutRefresh_tokenNestedInput
  }

  export type refresh_tokenUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_revoked?: BoolFieldUpdateOperationsInput | boolean
    issued_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    token?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
  }

  export type refresh_tokenCreateManyInput = {
    id?: bigint | number
    expires_at?: Date | string | null
    is_revoked: boolean
    issued_at?: Date | string | null
    token?: string | null
    user_id?: Uint8Array | null
  }

  export type refresh_tokenUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_revoked?: BoolFieldUpdateOperationsInput | boolean
    issued_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    token?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type refresh_tokenUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_revoked?: BoolFieldUpdateOperationsInput | boolean
    issued_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    token?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
  }

  export type subjectCreateInput = {
    id?: bigint | number
    created_at?: string | null
    name: string
    status?: $Enums.subject_status | null
    updated_at?: string | null
    book?: bookCreateNestedManyWithoutSubjectInput
    grade?: gradeCreateNestedOneWithoutSubjectInput
  }

  export type subjectUncheckedCreateInput = {
    id?: bigint | number
    created_at?: string | null
    name: string
    status?: $Enums.subject_status | null
    updated_at?: string | null
    grade_id?: bigint | number | null
    book?: bookUncheckedCreateNestedManyWithoutSubjectInput
  }

  export type subjectUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    status?: NullableEnumsubject_statusFieldUpdateOperationsInput | $Enums.subject_status | null
    updated_at?: NullableStringFieldUpdateOperationsInput | string | null
    book?: bookUpdateManyWithoutSubjectNestedInput
    grade?: gradeUpdateOneWithoutSubjectNestedInput
  }

  export type subjectUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    status?: NullableEnumsubject_statusFieldUpdateOperationsInput | $Enums.subject_status | null
    updated_at?: NullableStringFieldUpdateOperationsInput | string | null
    grade_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    book?: bookUncheckedUpdateManyWithoutSubjectNestedInput
  }

  export type subjectCreateManyInput = {
    id?: bigint | number
    created_at?: string | null
    name: string
    status?: $Enums.subject_status | null
    updated_at?: string | null
    grade_id?: bigint | number | null
  }

  export type subjectUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    status?: NullableEnumsubject_statusFieldUpdateOperationsInput | $Enums.subject_status | null
    updated_at?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type subjectUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    status?: NullableEnumsubject_statusFieldUpdateOperationsInput | $Enums.subject_status | null
    updated_at?: NullableStringFieldUpdateOperationsInput | string | null
    grade_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type userCreateInput = {
    id: Uint8Array
    email?: string | null
    full_name?: string | null
    password?: string | null
    role?: $Enums.user_role | null
    username?: string | null
    refresh_token?: refresh_tokenCreateNestedManyWithoutUserInput
    work_space?: work_spaceCreateNestedManyWithoutUserInput
  }

  export type userUncheckedCreateInput = {
    id: Uint8Array
    email?: string | null
    full_name?: string | null
    password?: string | null
    role?: $Enums.user_role | null
    username?: string | null
    refresh_token?: refresh_tokenUncheckedCreateNestedManyWithoutUserInput
    work_space?: work_spaceUncheckedCreateNestedManyWithoutUserInput
  }

  export type userUpdateInput = {
    id?: BytesFieldUpdateOperationsInput | Uint8Array
    email?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableEnumuser_roleFieldUpdateOperationsInput | $Enums.user_role | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    refresh_token?: refresh_tokenUpdateManyWithoutUserNestedInput
    work_space?: work_spaceUpdateManyWithoutUserNestedInput
  }

  export type userUncheckedUpdateInput = {
    id?: BytesFieldUpdateOperationsInput | Uint8Array
    email?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableEnumuser_roleFieldUpdateOperationsInput | $Enums.user_role | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    refresh_token?: refresh_tokenUncheckedUpdateManyWithoutUserNestedInput
    work_space?: work_spaceUncheckedUpdateManyWithoutUserNestedInput
  }

  export type userCreateManyInput = {
    id: Uint8Array
    email?: string | null
    full_name?: string | null
    password?: string | null
    role?: $Enums.user_role | null
    username?: string | null
  }

  export type userUpdateManyMutationInput = {
    id?: BytesFieldUpdateOperationsInput | Uint8Array
    email?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableEnumuser_roleFieldUpdateOperationsInput | $Enums.user_role | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type userUncheckedUpdateManyInput = {
    id?: BytesFieldUpdateOperationsInput | Uint8Array
    email?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableEnumuser_roleFieldUpdateOperationsInput | $Enums.user_role | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type work_spaceCreateInput = {
    id: Uint8Array
    name?: string | null
    academic_year?: academic_yearCreateNestedOneWithoutWork_spaceInput
    user?: userCreateNestedOneWithoutWork_spaceInput
  }

  export type work_spaceUncheckedCreateInput = {
    id: Uint8Array
    name?: string | null
    academic_year_id?: Uint8Array | null
    account_id?: Uint8Array | null
  }

  export type work_spaceUpdateInput = {
    id?: BytesFieldUpdateOperationsInput | Uint8Array
    name?: NullableStringFieldUpdateOperationsInput | string | null
    academic_year?: academic_yearUpdateOneWithoutWork_spaceNestedInput
    user?: userUpdateOneWithoutWork_spaceNestedInput
  }

  export type work_spaceUncheckedUpdateInput = {
    id?: BytesFieldUpdateOperationsInput | Uint8Array
    name?: NullableStringFieldUpdateOperationsInput | string | null
    academic_year_id?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    account_id?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
  }

  export type work_spaceCreateManyInput = {
    id: Uint8Array
    name?: string | null
    academic_year_id?: Uint8Array | null
    account_id?: Uint8Array | null
  }

  export type work_spaceUpdateManyMutationInput = {
    id?: BytesFieldUpdateOperationsInput | Uint8Array
    name?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type work_spaceUncheckedUpdateManyInput = {
    id?: BytesFieldUpdateOperationsInput | Uint8Array
    name?: NullableStringFieldUpdateOperationsInput | string | null
    academic_year_id?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    account_id?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
  }

  export type book_typeCreateInput = {
    id: Uint8Array
    created_at?: string | null
    description?: string | null
    icon?: string | null
    name?: string | null
    status?: $Enums.book_type_status | null
    updated_at?: string | null
    token_cost_per_query: number
  }

  export type book_typeUncheckedCreateInput = {
    id: Uint8Array
    created_at?: string | null
    description?: string | null
    icon?: string | null
    name?: string | null
    status?: $Enums.book_type_status | null
    updated_at?: string | null
    token_cost_per_query: number
  }

  export type book_typeUpdateInput = {
    id?: BytesFieldUpdateOperationsInput | Uint8Array
    created_at?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableEnumbook_type_statusFieldUpdateOperationsInput | $Enums.book_type_status | null
    updated_at?: NullableStringFieldUpdateOperationsInput | string | null
    token_cost_per_query?: IntFieldUpdateOperationsInput | number
  }

  export type book_typeUncheckedUpdateInput = {
    id?: BytesFieldUpdateOperationsInput | Uint8Array
    created_at?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableEnumbook_type_statusFieldUpdateOperationsInput | $Enums.book_type_status | null
    updated_at?: NullableStringFieldUpdateOperationsInput | string | null
    token_cost_per_query?: IntFieldUpdateOperationsInput | number
  }

  export type book_typeCreateManyInput = {
    id: Uint8Array
    created_at?: string | null
    description?: string | null
    icon?: string | null
    name?: string | null
    status?: $Enums.book_type_status | null
    updated_at?: string | null
    token_cost_per_query: number
  }

  export type book_typeUpdateManyMutationInput = {
    id?: BytesFieldUpdateOperationsInput | Uint8Array
    created_at?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableEnumbook_type_statusFieldUpdateOperationsInput | $Enums.book_type_status | null
    updated_at?: NullableStringFieldUpdateOperationsInput | string | null
    token_cost_per_query?: IntFieldUpdateOperationsInput | number
  }

  export type book_typeUncheckedUpdateManyInput = {
    id?: BytesFieldUpdateOperationsInput | Uint8Array
    created_at?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableEnumbook_type_statusFieldUpdateOperationsInput | $Enums.book_type_status | null
    updated_at?: NullableStringFieldUpdateOperationsInput | string | null
    token_cost_per_query?: IntFieldUpdateOperationsInput | number
  }

  export type BytesFilter<$PrismaModel = never> = {
    equals?: Uint8Array | BytesFieldRefInput<$PrismaModel>
    in?: Uint8Array[]
    notIn?: Uint8Array[]
    not?: NestedBytesFilter<$PrismaModel> | Uint8Array
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type Enumacademic_year_statusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.academic_year_status | Enumacademic_year_statusFieldRefInput<$PrismaModel> | null
    in?: $Enums.academic_year_status[] | null
    notIn?: $Enums.academic_year_status[] | null
    not?: NestedEnumacademic_year_statusNullableFilter<$PrismaModel> | $Enums.academic_year_status | null
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type Work_spaceListRelationFilter = {
    every?: work_spaceWhereInput
    some?: work_spaceWhereInput
    none?: work_spaceWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type work_spaceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type academic_yearOrderByRelevanceInput = {
    fields: academic_yearOrderByRelevanceFieldEnum | academic_yearOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type academic_yearCountOrderByAggregateInput = {
    id?: SortOrder
    created_at?: SortOrder
    end_date?: SortOrder
    start_date?: SortOrder
    status?: SortOrder
    updated_at?: SortOrder
    year_label?: SortOrder
  }

  export type academic_yearMaxOrderByAggregateInput = {
    id?: SortOrder
    created_at?: SortOrder
    end_date?: SortOrder
    start_date?: SortOrder
    status?: SortOrder
    updated_at?: SortOrder
    year_label?: SortOrder
  }

  export type academic_yearMinOrderByAggregateInput = {
    id?: SortOrder
    created_at?: SortOrder
    end_date?: SortOrder
    start_date?: SortOrder
    status?: SortOrder
    updated_at?: SortOrder
    year_label?: SortOrder
  }

  export type BytesWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Uint8Array | BytesFieldRefInput<$PrismaModel>
    in?: Uint8Array[]
    notIn?: Uint8Array[]
    not?: NestedBytesWithAggregatesFilter<$PrismaModel> | Uint8Array
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBytesFilter<$PrismaModel>
    _max?: NestedBytesFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type Enumacademic_year_statusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.academic_year_status | Enumacademic_year_statusFieldRefInput<$PrismaModel> | null
    in?: $Enums.academic_year_status[] | null
    notIn?: $Enums.academic_year_status[] | null
    not?: NestedEnumacademic_year_statusNullableWithAggregatesFilter<$PrismaModel> | $Enums.academic_year_status | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumacademic_year_statusNullableFilter<$PrismaModel>
    _max?: NestedEnumacademic_year_statusNullableFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type Enumbook_statusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.book_status | Enumbook_statusFieldRefInput<$PrismaModel> | null
    in?: $Enums.book_status[] | null
    notIn?: $Enums.book_status[] | null
    not?: NestedEnumbook_statusNullableFilter<$PrismaModel> | $Enums.book_status | null
  }

  export type BigIntNullableFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | null
    notIn?: bigint[] | number[] | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableFilter<$PrismaModel> | bigint | number | null
  }

  export type SubjectNullableScalarRelationFilter = {
    is?: subjectWhereInput | null
    isNot?: subjectWhereInput | null
  }

  export type ChapterListRelationFilter = {
    every?: chapterWhereInput
    some?: chapterWhereInput
    none?: chapterWhereInput
  }

  export type chapterOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type bookOrderByRelevanceInput = {
    fields: bookOrderByRelevanceFieldEnum | bookOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type bookCountOrderByAggregateInput = {
    id?: SortOrder
    created_at?: SortOrder
    name?: SortOrder
    status?: SortOrder
    updated_at?: SortOrder
    subject_id?: SortOrder
  }

  export type bookAvgOrderByAggregateInput = {
    id?: SortOrder
    subject_id?: SortOrder
  }

  export type bookMaxOrderByAggregateInput = {
    id?: SortOrder
    created_at?: SortOrder
    name?: SortOrder
    status?: SortOrder
    updated_at?: SortOrder
    subject_id?: SortOrder
  }

  export type bookMinOrderByAggregateInput = {
    id?: SortOrder
    created_at?: SortOrder
    name?: SortOrder
    status?: SortOrder
    updated_at?: SortOrder
    subject_id?: SortOrder
  }

  export type bookSumOrderByAggregateInput = {
    id?: SortOrder
    subject_id?: SortOrder
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type Enumbook_statusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.book_status | Enumbook_statusFieldRefInput<$PrismaModel> | null
    in?: $Enums.book_status[] | null
    notIn?: $Enums.book_status[] | null
    not?: NestedEnumbook_statusNullableWithAggregatesFilter<$PrismaModel> | $Enums.book_status | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumbook_statusNullableFilter<$PrismaModel>
    _max?: NestedEnumbook_statusNullableFilter<$PrismaModel>
  }

  export type BigIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | null
    notIn?: bigint[] | number[] | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableWithAggregatesFilter<$PrismaModel> | bigint | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedBigIntNullableFilter<$PrismaModel>
    _min?: NestedBigIntNullableFilter<$PrismaModel>
    _max?: NestedBigIntNullableFilter<$PrismaModel>
  }

  export type Enumchapter_statusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.chapter_status | Enumchapter_statusFieldRefInput<$PrismaModel> | null
    in?: $Enums.chapter_status[] | null
    notIn?: $Enums.chapter_status[] | null
    not?: NestedEnumchapter_statusNullableFilter<$PrismaModel> | $Enums.chapter_status | null
  }

  export type BookNullableScalarRelationFilter = {
    is?: bookWhereInput | null
    isNot?: bookWhereInput | null
  }

  export type LessonListRelationFilter = {
    every?: lessonWhereInput
    some?: lessonWhereInput
    none?: lessonWhereInput
  }

  export type lessonOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type chapterOrderByRelevanceInput = {
    fields: chapterOrderByRelevanceFieldEnum | chapterOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type chapterCountOrderByAggregateInput = {
    id?: SortOrder
    created_at?: SortOrder
    name?: SortOrder
    status?: SortOrder
    updated_at?: SortOrder
    book_id?: SortOrder
  }

  export type chapterAvgOrderByAggregateInput = {
    id?: SortOrder
    book_id?: SortOrder
  }

  export type chapterMaxOrderByAggregateInput = {
    id?: SortOrder
    created_at?: SortOrder
    name?: SortOrder
    status?: SortOrder
    updated_at?: SortOrder
    book_id?: SortOrder
  }

  export type chapterMinOrderByAggregateInput = {
    id?: SortOrder
    created_at?: SortOrder
    name?: SortOrder
    status?: SortOrder
    updated_at?: SortOrder
    book_id?: SortOrder
  }

  export type chapterSumOrderByAggregateInput = {
    id?: SortOrder
    book_id?: SortOrder
  }

  export type Enumchapter_statusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.chapter_status | Enumchapter_statusFieldRefInput<$PrismaModel> | null
    in?: $Enums.chapter_status[] | null
    notIn?: $Enums.chapter_status[] | null
    not?: NestedEnumchapter_statusNullableWithAggregatesFilter<$PrismaModel> | $Enums.chapter_status | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumchapter_statusNullableFilter<$PrismaModel>
    _max?: NestedEnumchapter_statusNullableFilter<$PrismaModel>
  }

  export type Enumgrade_statusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.grade_status | Enumgrade_statusFieldRefInput<$PrismaModel> | null
    in?: $Enums.grade_status[] | null
    notIn?: $Enums.grade_status[] | null
    not?: NestedEnumgrade_statusNullableFilter<$PrismaModel> | $Enums.grade_status | null
  }

  export type SubjectListRelationFilter = {
    every?: subjectWhereInput
    some?: subjectWhereInput
    none?: subjectWhereInput
  }

  export type subjectOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type gradeOrderByRelevanceInput = {
    fields: gradeOrderByRelevanceFieldEnum | gradeOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type gradeCountOrderByAggregateInput = {
    id?: SortOrder
    created_at?: SortOrder
    name?: SortOrder
    status?: SortOrder
    updated_at?: SortOrder
  }

  export type gradeAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type gradeMaxOrderByAggregateInput = {
    id?: SortOrder
    created_at?: SortOrder
    name?: SortOrder
    status?: SortOrder
    updated_at?: SortOrder
  }

  export type gradeMinOrderByAggregateInput = {
    id?: SortOrder
    created_at?: SortOrder
    name?: SortOrder
    status?: SortOrder
    updated_at?: SortOrder
  }

  export type gradeSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type Enumgrade_statusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.grade_status | Enumgrade_statusFieldRefInput<$PrismaModel> | null
    in?: $Enums.grade_status[] | null
    notIn?: $Enums.grade_status[] | null
    not?: NestedEnumgrade_statusNullableWithAggregatesFilter<$PrismaModel> | $Enums.grade_status | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumgrade_statusNullableFilter<$PrismaModel>
    _max?: NestedEnumgrade_statusNullableFilter<$PrismaModel>
  }

  export type Enumlesson_statusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.lesson_status | Enumlesson_statusFieldRefInput<$PrismaModel> | null
    in?: $Enums.lesson_status[] | null
    notIn?: $Enums.lesson_status[] | null
    not?: NestedEnumlesson_statusNullableFilter<$PrismaModel> | $Enums.lesson_status | null
  }

  export type ChapterNullableScalarRelationFilter = {
    is?: chapterWhereInput | null
    isNot?: chapterWhereInput | null
  }

  export type lessonOrderByRelevanceInput = {
    fields: lessonOrderByRelevanceFieldEnum | lessonOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type lessonCountOrderByAggregateInput = {
    id?: SortOrder
    created_at?: SortOrder
    name?: SortOrder
    status?: SortOrder
    updated_at?: SortOrder
    chapter_id?: SortOrder
  }

  export type lessonAvgOrderByAggregateInput = {
    id?: SortOrder
    chapter_id?: SortOrder
  }

  export type lessonMaxOrderByAggregateInput = {
    id?: SortOrder
    created_at?: SortOrder
    name?: SortOrder
    status?: SortOrder
    updated_at?: SortOrder
    chapter_id?: SortOrder
  }

  export type lessonMinOrderByAggregateInput = {
    id?: SortOrder
    created_at?: SortOrder
    name?: SortOrder
    status?: SortOrder
    updated_at?: SortOrder
    chapter_id?: SortOrder
  }

  export type lessonSumOrderByAggregateInput = {
    id?: SortOrder
    chapter_id?: SortOrder
  }

  export type Enumlesson_statusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.lesson_status | Enumlesson_statusFieldRefInput<$PrismaModel> | null
    in?: $Enums.lesson_status[] | null
    notIn?: $Enums.lesson_status[] | null
    not?: NestedEnumlesson_statusNullableWithAggregatesFilter<$PrismaModel> | $Enums.lesson_status | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumlesson_statusNullableFilter<$PrismaModel>
    _max?: NestedEnumlesson_statusNullableFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type BytesNullableFilter<$PrismaModel = never> = {
    equals?: Uint8Array | BytesFieldRefInput<$PrismaModel> | null
    in?: Uint8Array[] | null
    notIn?: Uint8Array[] | null
    not?: NestedBytesNullableFilter<$PrismaModel> | Uint8Array | null
  }

  export type UserNullableScalarRelationFilter = {
    is?: userWhereInput | null
    isNot?: userWhereInput | null
  }

  export type refresh_tokenOrderByRelevanceInput = {
    fields: refresh_tokenOrderByRelevanceFieldEnum | refresh_tokenOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type refresh_tokenCountOrderByAggregateInput = {
    id?: SortOrder
    expires_at?: SortOrder
    is_revoked?: SortOrder
    issued_at?: SortOrder
    token?: SortOrder
    user_id?: SortOrder
  }

  export type refresh_tokenAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type refresh_tokenMaxOrderByAggregateInput = {
    id?: SortOrder
    expires_at?: SortOrder
    is_revoked?: SortOrder
    issued_at?: SortOrder
    token?: SortOrder
    user_id?: SortOrder
  }

  export type refresh_tokenMinOrderByAggregateInput = {
    id?: SortOrder
    expires_at?: SortOrder
    is_revoked?: SortOrder
    issued_at?: SortOrder
    token?: SortOrder
    user_id?: SortOrder
  }

  export type refresh_tokenSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type BytesNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Uint8Array | BytesFieldRefInput<$PrismaModel> | null
    in?: Uint8Array[] | null
    notIn?: Uint8Array[] | null
    not?: NestedBytesNullableWithAggregatesFilter<$PrismaModel> | Uint8Array | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBytesNullableFilter<$PrismaModel>
    _max?: NestedBytesNullableFilter<$PrismaModel>
  }

  export type Enumsubject_statusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.subject_status | Enumsubject_statusFieldRefInput<$PrismaModel> | null
    in?: $Enums.subject_status[] | null
    notIn?: $Enums.subject_status[] | null
    not?: NestedEnumsubject_statusNullableFilter<$PrismaModel> | $Enums.subject_status | null
  }

  export type BookListRelationFilter = {
    every?: bookWhereInput
    some?: bookWhereInput
    none?: bookWhereInput
  }

  export type GradeNullableScalarRelationFilter = {
    is?: gradeWhereInput | null
    isNot?: gradeWhereInput | null
  }

  export type bookOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type subjectOrderByRelevanceInput = {
    fields: subjectOrderByRelevanceFieldEnum | subjectOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type subjectCountOrderByAggregateInput = {
    id?: SortOrder
    created_at?: SortOrder
    name?: SortOrder
    status?: SortOrder
    updated_at?: SortOrder
    grade_id?: SortOrder
  }

  export type subjectAvgOrderByAggregateInput = {
    id?: SortOrder
    grade_id?: SortOrder
  }

  export type subjectMaxOrderByAggregateInput = {
    id?: SortOrder
    created_at?: SortOrder
    name?: SortOrder
    status?: SortOrder
    updated_at?: SortOrder
    grade_id?: SortOrder
  }

  export type subjectMinOrderByAggregateInput = {
    id?: SortOrder
    created_at?: SortOrder
    name?: SortOrder
    status?: SortOrder
    updated_at?: SortOrder
    grade_id?: SortOrder
  }

  export type subjectSumOrderByAggregateInput = {
    id?: SortOrder
    grade_id?: SortOrder
  }

  export type Enumsubject_statusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.subject_status | Enumsubject_statusFieldRefInput<$PrismaModel> | null
    in?: $Enums.subject_status[] | null
    notIn?: $Enums.subject_status[] | null
    not?: NestedEnumsubject_statusNullableWithAggregatesFilter<$PrismaModel> | $Enums.subject_status | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumsubject_statusNullableFilter<$PrismaModel>
    _max?: NestedEnumsubject_statusNullableFilter<$PrismaModel>
  }

  export type Enumuser_roleNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.user_role | Enumuser_roleFieldRefInput<$PrismaModel> | null
    in?: $Enums.user_role[] | null
    notIn?: $Enums.user_role[] | null
    not?: NestedEnumuser_roleNullableFilter<$PrismaModel> | $Enums.user_role | null
  }

  export type Refresh_tokenListRelationFilter = {
    every?: refresh_tokenWhereInput
    some?: refresh_tokenWhereInput
    none?: refresh_tokenWhereInput
  }

  export type refresh_tokenOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type userOrderByRelevanceInput = {
    fields: userOrderByRelevanceFieldEnum | userOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type userCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    full_name?: SortOrder
    password?: SortOrder
    role?: SortOrder
    username?: SortOrder
  }

  export type userMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    full_name?: SortOrder
    password?: SortOrder
    role?: SortOrder
    username?: SortOrder
  }

  export type userMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    full_name?: SortOrder
    password?: SortOrder
    role?: SortOrder
    username?: SortOrder
  }

  export type Enumuser_roleNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.user_role | Enumuser_roleFieldRefInput<$PrismaModel> | null
    in?: $Enums.user_role[] | null
    notIn?: $Enums.user_role[] | null
    not?: NestedEnumuser_roleNullableWithAggregatesFilter<$PrismaModel> | $Enums.user_role | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumuser_roleNullableFilter<$PrismaModel>
    _max?: NestedEnumuser_roleNullableFilter<$PrismaModel>
  }

  export type Academic_yearNullableScalarRelationFilter = {
    is?: academic_yearWhereInput | null
    isNot?: academic_yearWhereInput | null
  }

  export type work_spaceOrderByRelevanceInput = {
    fields: work_spaceOrderByRelevanceFieldEnum | work_spaceOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type work_spaceCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    academic_year_id?: SortOrder
    account_id?: SortOrder
  }

  export type work_spaceMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    academic_year_id?: SortOrder
    account_id?: SortOrder
  }

  export type work_spaceMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    academic_year_id?: SortOrder
    account_id?: SortOrder
  }

  export type Enumbook_type_statusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.book_type_status | Enumbook_type_statusFieldRefInput<$PrismaModel> | null
    in?: $Enums.book_type_status[] | null
    notIn?: $Enums.book_type_status[] | null
    not?: NestedEnumbook_type_statusNullableFilter<$PrismaModel> | $Enums.book_type_status | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type book_typeOrderByRelevanceInput = {
    fields: book_typeOrderByRelevanceFieldEnum | book_typeOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type book_typeCountOrderByAggregateInput = {
    id?: SortOrder
    created_at?: SortOrder
    description?: SortOrder
    icon?: SortOrder
    name?: SortOrder
    status?: SortOrder
    updated_at?: SortOrder
    token_cost_per_query?: SortOrder
  }

  export type book_typeAvgOrderByAggregateInput = {
    token_cost_per_query?: SortOrder
  }

  export type book_typeMaxOrderByAggregateInput = {
    id?: SortOrder
    created_at?: SortOrder
    description?: SortOrder
    icon?: SortOrder
    name?: SortOrder
    status?: SortOrder
    updated_at?: SortOrder
    token_cost_per_query?: SortOrder
  }

  export type book_typeMinOrderByAggregateInput = {
    id?: SortOrder
    created_at?: SortOrder
    description?: SortOrder
    icon?: SortOrder
    name?: SortOrder
    status?: SortOrder
    updated_at?: SortOrder
    token_cost_per_query?: SortOrder
  }

  export type book_typeSumOrderByAggregateInput = {
    token_cost_per_query?: SortOrder
  }

  export type Enumbook_type_statusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.book_type_status | Enumbook_type_statusFieldRefInput<$PrismaModel> | null
    in?: $Enums.book_type_status[] | null
    notIn?: $Enums.book_type_status[] | null
    not?: NestedEnumbook_type_statusNullableWithAggregatesFilter<$PrismaModel> | $Enums.book_type_status | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumbook_type_statusNullableFilter<$PrismaModel>
    _max?: NestedEnumbook_type_statusNullableFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type work_spaceCreateNestedManyWithoutAcademic_yearInput = {
    create?: XOR<work_spaceCreateWithoutAcademic_yearInput, work_spaceUncheckedCreateWithoutAcademic_yearInput> | work_spaceCreateWithoutAcademic_yearInput[] | work_spaceUncheckedCreateWithoutAcademic_yearInput[]
    connectOrCreate?: work_spaceCreateOrConnectWithoutAcademic_yearInput | work_spaceCreateOrConnectWithoutAcademic_yearInput[]
    createMany?: work_spaceCreateManyAcademic_yearInputEnvelope
    connect?: work_spaceWhereUniqueInput | work_spaceWhereUniqueInput[]
  }

  export type work_spaceUncheckedCreateNestedManyWithoutAcademic_yearInput = {
    create?: XOR<work_spaceCreateWithoutAcademic_yearInput, work_spaceUncheckedCreateWithoutAcademic_yearInput> | work_spaceCreateWithoutAcademic_yearInput[] | work_spaceUncheckedCreateWithoutAcademic_yearInput[]
    connectOrCreate?: work_spaceCreateOrConnectWithoutAcademic_yearInput | work_spaceCreateOrConnectWithoutAcademic_yearInput[]
    createMany?: work_spaceCreateManyAcademic_yearInputEnvelope
    connect?: work_spaceWhereUniqueInput | work_spaceWhereUniqueInput[]
  }

  export type BytesFieldUpdateOperationsInput = {
    set?: Uint8Array
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableEnumacademic_year_statusFieldUpdateOperationsInput = {
    set?: $Enums.academic_year_status | null
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type work_spaceUpdateManyWithoutAcademic_yearNestedInput = {
    create?: XOR<work_spaceCreateWithoutAcademic_yearInput, work_spaceUncheckedCreateWithoutAcademic_yearInput> | work_spaceCreateWithoutAcademic_yearInput[] | work_spaceUncheckedCreateWithoutAcademic_yearInput[]
    connectOrCreate?: work_spaceCreateOrConnectWithoutAcademic_yearInput | work_spaceCreateOrConnectWithoutAcademic_yearInput[]
    upsert?: work_spaceUpsertWithWhereUniqueWithoutAcademic_yearInput | work_spaceUpsertWithWhereUniqueWithoutAcademic_yearInput[]
    createMany?: work_spaceCreateManyAcademic_yearInputEnvelope
    set?: work_spaceWhereUniqueInput | work_spaceWhereUniqueInput[]
    disconnect?: work_spaceWhereUniqueInput | work_spaceWhereUniqueInput[]
    delete?: work_spaceWhereUniqueInput | work_spaceWhereUniqueInput[]
    connect?: work_spaceWhereUniqueInput | work_spaceWhereUniqueInput[]
    update?: work_spaceUpdateWithWhereUniqueWithoutAcademic_yearInput | work_spaceUpdateWithWhereUniqueWithoutAcademic_yearInput[]
    updateMany?: work_spaceUpdateManyWithWhereWithoutAcademic_yearInput | work_spaceUpdateManyWithWhereWithoutAcademic_yearInput[]
    deleteMany?: work_spaceScalarWhereInput | work_spaceScalarWhereInput[]
  }

  export type work_spaceUncheckedUpdateManyWithoutAcademic_yearNestedInput = {
    create?: XOR<work_spaceCreateWithoutAcademic_yearInput, work_spaceUncheckedCreateWithoutAcademic_yearInput> | work_spaceCreateWithoutAcademic_yearInput[] | work_spaceUncheckedCreateWithoutAcademic_yearInput[]
    connectOrCreate?: work_spaceCreateOrConnectWithoutAcademic_yearInput | work_spaceCreateOrConnectWithoutAcademic_yearInput[]
    upsert?: work_spaceUpsertWithWhereUniqueWithoutAcademic_yearInput | work_spaceUpsertWithWhereUniqueWithoutAcademic_yearInput[]
    createMany?: work_spaceCreateManyAcademic_yearInputEnvelope
    set?: work_spaceWhereUniqueInput | work_spaceWhereUniqueInput[]
    disconnect?: work_spaceWhereUniqueInput | work_spaceWhereUniqueInput[]
    delete?: work_spaceWhereUniqueInput | work_spaceWhereUniqueInput[]
    connect?: work_spaceWhereUniqueInput | work_spaceWhereUniqueInput[]
    update?: work_spaceUpdateWithWhereUniqueWithoutAcademic_yearInput | work_spaceUpdateWithWhereUniqueWithoutAcademic_yearInput[]
    updateMany?: work_spaceUpdateManyWithWhereWithoutAcademic_yearInput | work_spaceUpdateManyWithWhereWithoutAcademic_yearInput[]
    deleteMany?: work_spaceScalarWhereInput | work_spaceScalarWhereInput[]
  }

  export type subjectCreateNestedOneWithoutBookInput = {
    create?: XOR<subjectCreateWithoutBookInput, subjectUncheckedCreateWithoutBookInput>
    connectOrCreate?: subjectCreateOrConnectWithoutBookInput
    connect?: subjectWhereUniqueInput
  }

  export type chapterCreateNestedManyWithoutBookInput = {
    create?: XOR<chapterCreateWithoutBookInput, chapterUncheckedCreateWithoutBookInput> | chapterCreateWithoutBookInput[] | chapterUncheckedCreateWithoutBookInput[]
    connectOrCreate?: chapterCreateOrConnectWithoutBookInput | chapterCreateOrConnectWithoutBookInput[]
    createMany?: chapterCreateManyBookInputEnvelope
    connect?: chapterWhereUniqueInput | chapterWhereUniqueInput[]
  }

  export type chapterUncheckedCreateNestedManyWithoutBookInput = {
    create?: XOR<chapterCreateWithoutBookInput, chapterUncheckedCreateWithoutBookInput> | chapterCreateWithoutBookInput[] | chapterUncheckedCreateWithoutBookInput[]
    connectOrCreate?: chapterCreateOrConnectWithoutBookInput | chapterCreateOrConnectWithoutBookInput[]
    createMany?: chapterCreateManyBookInputEnvelope
    connect?: chapterWhereUniqueInput | chapterWhereUniqueInput[]
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableEnumbook_statusFieldUpdateOperationsInput = {
    set?: $Enums.book_status | null
  }

  export type subjectUpdateOneWithoutBookNestedInput = {
    create?: XOR<subjectCreateWithoutBookInput, subjectUncheckedCreateWithoutBookInput>
    connectOrCreate?: subjectCreateOrConnectWithoutBookInput
    upsert?: subjectUpsertWithoutBookInput
    disconnect?: subjectWhereInput | boolean
    delete?: subjectWhereInput | boolean
    connect?: subjectWhereUniqueInput
    update?: XOR<XOR<subjectUpdateToOneWithWhereWithoutBookInput, subjectUpdateWithoutBookInput>, subjectUncheckedUpdateWithoutBookInput>
  }

  export type chapterUpdateManyWithoutBookNestedInput = {
    create?: XOR<chapterCreateWithoutBookInput, chapterUncheckedCreateWithoutBookInput> | chapterCreateWithoutBookInput[] | chapterUncheckedCreateWithoutBookInput[]
    connectOrCreate?: chapterCreateOrConnectWithoutBookInput | chapterCreateOrConnectWithoutBookInput[]
    upsert?: chapterUpsertWithWhereUniqueWithoutBookInput | chapterUpsertWithWhereUniqueWithoutBookInput[]
    createMany?: chapterCreateManyBookInputEnvelope
    set?: chapterWhereUniqueInput | chapterWhereUniqueInput[]
    disconnect?: chapterWhereUniqueInput | chapterWhereUniqueInput[]
    delete?: chapterWhereUniqueInput | chapterWhereUniqueInput[]
    connect?: chapterWhereUniqueInput | chapterWhereUniqueInput[]
    update?: chapterUpdateWithWhereUniqueWithoutBookInput | chapterUpdateWithWhereUniqueWithoutBookInput[]
    updateMany?: chapterUpdateManyWithWhereWithoutBookInput | chapterUpdateManyWithWhereWithoutBookInput[]
    deleteMany?: chapterScalarWhereInput | chapterScalarWhereInput[]
  }

  export type NullableBigIntFieldUpdateOperationsInput = {
    set?: bigint | number | null
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type chapterUncheckedUpdateManyWithoutBookNestedInput = {
    create?: XOR<chapterCreateWithoutBookInput, chapterUncheckedCreateWithoutBookInput> | chapterCreateWithoutBookInput[] | chapterUncheckedCreateWithoutBookInput[]
    connectOrCreate?: chapterCreateOrConnectWithoutBookInput | chapterCreateOrConnectWithoutBookInput[]
    upsert?: chapterUpsertWithWhereUniqueWithoutBookInput | chapterUpsertWithWhereUniqueWithoutBookInput[]
    createMany?: chapterCreateManyBookInputEnvelope
    set?: chapterWhereUniqueInput | chapterWhereUniqueInput[]
    disconnect?: chapterWhereUniqueInput | chapterWhereUniqueInput[]
    delete?: chapterWhereUniqueInput | chapterWhereUniqueInput[]
    connect?: chapterWhereUniqueInput | chapterWhereUniqueInput[]
    update?: chapterUpdateWithWhereUniqueWithoutBookInput | chapterUpdateWithWhereUniqueWithoutBookInput[]
    updateMany?: chapterUpdateManyWithWhereWithoutBookInput | chapterUpdateManyWithWhereWithoutBookInput[]
    deleteMany?: chapterScalarWhereInput | chapterScalarWhereInput[]
  }

  export type bookCreateNestedOneWithoutChapterInput = {
    create?: XOR<bookCreateWithoutChapterInput, bookUncheckedCreateWithoutChapterInput>
    connectOrCreate?: bookCreateOrConnectWithoutChapterInput
    connect?: bookWhereUniqueInput
  }

  export type lessonCreateNestedManyWithoutChapterInput = {
    create?: XOR<lessonCreateWithoutChapterInput, lessonUncheckedCreateWithoutChapterInput> | lessonCreateWithoutChapterInput[] | lessonUncheckedCreateWithoutChapterInput[]
    connectOrCreate?: lessonCreateOrConnectWithoutChapterInput | lessonCreateOrConnectWithoutChapterInput[]
    createMany?: lessonCreateManyChapterInputEnvelope
    connect?: lessonWhereUniqueInput | lessonWhereUniqueInput[]
  }

  export type lessonUncheckedCreateNestedManyWithoutChapterInput = {
    create?: XOR<lessonCreateWithoutChapterInput, lessonUncheckedCreateWithoutChapterInput> | lessonCreateWithoutChapterInput[] | lessonUncheckedCreateWithoutChapterInput[]
    connectOrCreate?: lessonCreateOrConnectWithoutChapterInput | lessonCreateOrConnectWithoutChapterInput[]
    createMany?: lessonCreateManyChapterInputEnvelope
    connect?: lessonWhereUniqueInput | lessonWhereUniqueInput[]
  }

  export type NullableEnumchapter_statusFieldUpdateOperationsInput = {
    set?: $Enums.chapter_status | null
  }

  export type bookUpdateOneWithoutChapterNestedInput = {
    create?: XOR<bookCreateWithoutChapterInput, bookUncheckedCreateWithoutChapterInput>
    connectOrCreate?: bookCreateOrConnectWithoutChapterInput
    upsert?: bookUpsertWithoutChapterInput
    disconnect?: bookWhereInput | boolean
    delete?: bookWhereInput | boolean
    connect?: bookWhereUniqueInput
    update?: XOR<XOR<bookUpdateToOneWithWhereWithoutChapterInput, bookUpdateWithoutChapterInput>, bookUncheckedUpdateWithoutChapterInput>
  }

  export type lessonUpdateManyWithoutChapterNestedInput = {
    create?: XOR<lessonCreateWithoutChapterInput, lessonUncheckedCreateWithoutChapterInput> | lessonCreateWithoutChapterInput[] | lessonUncheckedCreateWithoutChapterInput[]
    connectOrCreate?: lessonCreateOrConnectWithoutChapterInput | lessonCreateOrConnectWithoutChapterInput[]
    upsert?: lessonUpsertWithWhereUniqueWithoutChapterInput | lessonUpsertWithWhereUniqueWithoutChapterInput[]
    createMany?: lessonCreateManyChapterInputEnvelope
    set?: lessonWhereUniqueInput | lessonWhereUniqueInput[]
    disconnect?: lessonWhereUniqueInput | lessonWhereUniqueInput[]
    delete?: lessonWhereUniqueInput | lessonWhereUniqueInput[]
    connect?: lessonWhereUniqueInput | lessonWhereUniqueInput[]
    update?: lessonUpdateWithWhereUniqueWithoutChapterInput | lessonUpdateWithWhereUniqueWithoutChapterInput[]
    updateMany?: lessonUpdateManyWithWhereWithoutChapterInput | lessonUpdateManyWithWhereWithoutChapterInput[]
    deleteMany?: lessonScalarWhereInput | lessonScalarWhereInput[]
  }

  export type lessonUncheckedUpdateManyWithoutChapterNestedInput = {
    create?: XOR<lessonCreateWithoutChapterInput, lessonUncheckedCreateWithoutChapterInput> | lessonCreateWithoutChapterInput[] | lessonUncheckedCreateWithoutChapterInput[]
    connectOrCreate?: lessonCreateOrConnectWithoutChapterInput | lessonCreateOrConnectWithoutChapterInput[]
    upsert?: lessonUpsertWithWhereUniqueWithoutChapterInput | lessonUpsertWithWhereUniqueWithoutChapterInput[]
    createMany?: lessonCreateManyChapterInputEnvelope
    set?: lessonWhereUniqueInput | lessonWhereUniqueInput[]
    disconnect?: lessonWhereUniqueInput | lessonWhereUniqueInput[]
    delete?: lessonWhereUniqueInput | lessonWhereUniqueInput[]
    connect?: lessonWhereUniqueInput | lessonWhereUniqueInput[]
    update?: lessonUpdateWithWhereUniqueWithoutChapterInput | lessonUpdateWithWhereUniqueWithoutChapterInput[]
    updateMany?: lessonUpdateManyWithWhereWithoutChapterInput | lessonUpdateManyWithWhereWithoutChapterInput[]
    deleteMany?: lessonScalarWhereInput | lessonScalarWhereInput[]
  }

  export type subjectCreateNestedManyWithoutGradeInput = {
    create?: XOR<subjectCreateWithoutGradeInput, subjectUncheckedCreateWithoutGradeInput> | subjectCreateWithoutGradeInput[] | subjectUncheckedCreateWithoutGradeInput[]
    connectOrCreate?: subjectCreateOrConnectWithoutGradeInput | subjectCreateOrConnectWithoutGradeInput[]
    createMany?: subjectCreateManyGradeInputEnvelope
    connect?: subjectWhereUniqueInput | subjectWhereUniqueInput[]
  }

  export type subjectUncheckedCreateNestedManyWithoutGradeInput = {
    create?: XOR<subjectCreateWithoutGradeInput, subjectUncheckedCreateWithoutGradeInput> | subjectCreateWithoutGradeInput[] | subjectUncheckedCreateWithoutGradeInput[]
    connectOrCreate?: subjectCreateOrConnectWithoutGradeInput | subjectCreateOrConnectWithoutGradeInput[]
    createMany?: subjectCreateManyGradeInputEnvelope
    connect?: subjectWhereUniqueInput | subjectWhereUniqueInput[]
  }

  export type NullableEnumgrade_statusFieldUpdateOperationsInput = {
    set?: $Enums.grade_status | null
  }

  export type subjectUpdateManyWithoutGradeNestedInput = {
    create?: XOR<subjectCreateWithoutGradeInput, subjectUncheckedCreateWithoutGradeInput> | subjectCreateWithoutGradeInput[] | subjectUncheckedCreateWithoutGradeInput[]
    connectOrCreate?: subjectCreateOrConnectWithoutGradeInput | subjectCreateOrConnectWithoutGradeInput[]
    upsert?: subjectUpsertWithWhereUniqueWithoutGradeInput | subjectUpsertWithWhereUniqueWithoutGradeInput[]
    createMany?: subjectCreateManyGradeInputEnvelope
    set?: subjectWhereUniqueInput | subjectWhereUniqueInput[]
    disconnect?: subjectWhereUniqueInput | subjectWhereUniqueInput[]
    delete?: subjectWhereUniqueInput | subjectWhereUniqueInput[]
    connect?: subjectWhereUniqueInput | subjectWhereUniqueInput[]
    update?: subjectUpdateWithWhereUniqueWithoutGradeInput | subjectUpdateWithWhereUniqueWithoutGradeInput[]
    updateMany?: subjectUpdateManyWithWhereWithoutGradeInput | subjectUpdateManyWithWhereWithoutGradeInput[]
    deleteMany?: subjectScalarWhereInput | subjectScalarWhereInput[]
  }

  export type subjectUncheckedUpdateManyWithoutGradeNestedInput = {
    create?: XOR<subjectCreateWithoutGradeInput, subjectUncheckedCreateWithoutGradeInput> | subjectCreateWithoutGradeInput[] | subjectUncheckedCreateWithoutGradeInput[]
    connectOrCreate?: subjectCreateOrConnectWithoutGradeInput | subjectCreateOrConnectWithoutGradeInput[]
    upsert?: subjectUpsertWithWhereUniqueWithoutGradeInput | subjectUpsertWithWhereUniqueWithoutGradeInput[]
    createMany?: subjectCreateManyGradeInputEnvelope
    set?: subjectWhereUniqueInput | subjectWhereUniqueInput[]
    disconnect?: subjectWhereUniqueInput | subjectWhereUniqueInput[]
    delete?: subjectWhereUniqueInput | subjectWhereUniqueInput[]
    connect?: subjectWhereUniqueInput | subjectWhereUniqueInput[]
    update?: subjectUpdateWithWhereUniqueWithoutGradeInput | subjectUpdateWithWhereUniqueWithoutGradeInput[]
    updateMany?: subjectUpdateManyWithWhereWithoutGradeInput | subjectUpdateManyWithWhereWithoutGradeInput[]
    deleteMany?: subjectScalarWhereInput | subjectScalarWhereInput[]
  }

  export type chapterCreateNestedOneWithoutLessonInput = {
    create?: XOR<chapterCreateWithoutLessonInput, chapterUncheckedCreateWithoutLessonInput>
    connectOrCreate?: chapterCreateOrConnectWithoutLessonInput
    connect?: chapterWhereUniqueInput
  }

  export type NullableEnumlesson_statusFieldUpdateOperationsInput = {
    set?: $Enums.lesson_status | null
  }

  export type chapterUpdateOneWithoutLessonNestedInput = {
    create?: XOR<chapterCreateWithoutLessonInput, chapterUncheckedCreateWithoutLessonInput>
    connectOrCreate?: chapterCreateOrConnectWithoutLessonInput
    upsert?: chapterUpsertWithoutLessonInput
    disconnect?: chapterWhereInput | boolean
    delete?: chapterWhereInput | boolean
    connect?: chapterWhereUniqueInput
    update?: XOR<XOR<chapterUpdateToOneWithWhereWithoutLessonInput, chapterUpdateWithoutLessonInput>, chapterUncheckedUpdateWithoutLessonInput>
  }

  export type userCreateNestedOneWithoutRefresh_tokenInput = {
    create?: XOR<userCreateWithoutRefresh_tokenInput, userUncheckedCreateWithoutRefresh_tokenInput>
    connectOrCreate?: userCreateOrConnectWithoutRefresh_tokenInput
    connect?: userWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type userUpdateOneWithoutRefresh_tokenNestedInput = {
    create?: XOR<userCreateWithoutRefresh_tokenInput, userUncheckedCreateWithoutRefresh_tokenInput>
    connectOrCreate?: userCreateOrConnectWithoutRefresh_tokenInput
    upsert?: userUpsertWithoutRefresh_tokenInput
    disconnect?: userWhereInput | boolean
    delete?: userWhereInput | boolean
    connect?: userWhereUniqueInput
    update?: XOR<XOR<userUpdateToOneWithWhereWithoutRefresh_tokenInput, userUpdateWithoutRefresh_tokenInput>, userUncheckedUpdateWithoutRefresh_tokenInput>
  }

  export type NullableBytesFieldUpdateOperationsInput = {
    set?: Uint8Array | null
  }

  export type bookCreateNestedManyWithoutSubjectInput = {
    create?: XOR<bookCreateWithoutSubjectInput, bookUncheckedCreateWithoutSubjectInput> | bookCreateWithoutSubjectInput[] | bookUncheckedCreateWithoutSubjectInput[]
    connectOrCreate?: bookCreateOrConnectWithoutSubjectInput | bookCreateOrConnectWithoutSubjectInput[]
    createMany?: bookCreateManySubjectInputEnvelope
    connect?: bookWhereUniqueInput | bookWhereUniqueInput[]
  }

  export type gradeCreateNestedOneWithoutSubjectInput = {
    create?: XOR<gradeCreateWithoutSubjectInput, gradeUncheckedCreateWithoutSubjectInput>
    connectOrCreate?: gradeCreateOrConnectWithoutSubjectInput
    connect?: gradeWhereUniqueInput
  }

  export type bookUncheckedCreateNestedManyWithoutSubjectInput = {
    create?: XOR<bookCreateWithoutSubjectInput, bookUncheckedCreateWithoutSubjectInput> | bookCreateWithoutSubjectInput[] | bookUncheckedCreateWithoutSubjectInput[]
    connectOrCreate?: bookCreateOrConnectWithoutSubjectInput | bookCreateOrConnectWithoutSubjectInput[]
    createMany?: bookCreateManySubjectInputEnvelope
    connect?: bookWhereUniqueInput | bookWhereUniqueInput[]
  }

  export type NullableEnumsubject_statusFieldUpdateOperationsInput = {
    set?: $Enums.subject_status | null
  }

  export type bookUpdateManyWithoutSubjectNestedInput = {
    create?: XOR<bookCreateWithoutSubjectInput, bookUncheckedCreateWithoutSubjectInput> | bookCreateWithoutSubjectInput[] | bookUncheckedCreateWithoutSubjectInput[]
    connectOrCreate?: bookCreateOrConnectWithoutSubjectInput | bookCreateOrConnectWithoutSubjectInput[]
    upsert?: bookUpsertWithWhereUniqueWithoutSubjectInput | bookUpsertWithWhereUniqueWithoutSubjectInput[]
    createMany?: bookCreateManySubjectInputEnvelope
    set?: bookWhereUniqueInput | bookWhereUniqueInput[]
    disconnect?: bookWhereUniqueInput | bookWhereUniqueInput[]
    delete?: bookWhereUniqueInput | bookWhereUniqueInput[]
    connect?: bookWhereUniqueInput | bookWhereUniqueInput[]
    update?: bookUpdateWithWhereUniqueWithoutSubjectInput | bookUpdateWithWhereUniqueWithoutSubjectInput[]
    updateMany?: bookUpdateManyWithWhereWithoutSubjectInput | bookUpdateManyWithWhereWithoutSubjectInput[]
    deleteMany?: bookScalarWhereInput | bookScalarWhereInput[]
  }

  export type gradeUpdateOneWithoutSubjectNestedInput = {
    create?: XOR<gradeCreateWithoutSubjectInput, gradeUncheckedCreateWithoutSubjectInput>
    connectOrCreate?: gradeCreateOrConnectWithoutSubjectInput
    upsert?: gradeUpsertWithoutSubjectInput
    disconnect?: gradeWhereInput | boolean
    delete?: gradeWhereInput | boolean
    connect?: gradeWhereUniqueInput
    update?: XOR<XOR<gradeUpdateToOneWithWhereWithoutSubjectInput, gradeUpdateWithoutSubjectInput>, gradeUncheckedUpdateWithoutSubjectInput>
  }

  export type bookUncheckedUpdateManyWithoutSubjectNestedInput = {
    create?: XOR<bookCreateWithoutSubjectInput, bookUncheckedCreateWithoutSubjectInput> | bookCreateWithoutSubjectInput[] | bookUncheckedCreateWithoutSubjectInput[]
    connectOrCreate?: bookCreateOrConnectWithoutSubjectInput | bookCreateOrConnectWithoutSubjectInput[]
    upsert?: bookUpsertWithWhereUniqueWithoutSubjectInput | bookUpsertWithWhereUniqueWithoutSubjectInput[]
    createMany?: bookCreateManySubjectInputEnvelope
    set?: bookWhereUniqueInput | bookWhereUniqueInput[]
    disconnect?: bookWhereUniqueInput | bookWhereUniqueInput[]
    delete?: bookWhereUniqueInput | bookWhereUniqueInput[]
    connect?: bookWhereUniqueInput | bookWhereUniqueInput[]
    update?: bookUpdateWithWhereUniqueWithoutSubjectInput | bookUpdateWithWhereUniqueWithoutSubjectInput[]
    updateMany?: bookUpdateManyWithWhereWithoutSubjectInput | bookUpdateManyWithWhereWithoutSubjectInput[]
    deleteMany?: bookScalarWhereInput | bookScalarWhereInput[]
  }

  export type refresh_tokenCreateNestedManyWithoutUserInput = {
    create?: XOR<refresh_tokenCreateWithoutUserInput, refresh_tokenUncheckedCreateWithoutUserInput> | refresh_tokenCreateWithoutUserInput[] | refresh_tokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: refresh_tokenCreateOrConnectWithoutUserInput | refresh_tokenCreateOrConnectWithoutUserInput[]
    createMany?: refresh_tokenCreateManyUserInputEnvelope
    connect?: refresh_tokenWhereUniqueInput | refresh_tokenWhereUniqueInput[]
  }

  export type work_spaceCreateNestedManyWithoutUserInput = {
    create?: XOR<work_spaceCreateWithoutUserInput, work_spaceUncheckedCreateWithoutUserInput> | work_spaceCreateWithoutUserInput[] | work_spaceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: work_spaceCreateOrConnectWithoutUserInput | work_spaceCreateOrConnectWithoutUserInput[]
    createMany?: work_spaceCreateManyUserInputEnvelope
    connect?: work_spaceWhereUniqueInput | work_spaceWhereUniqueInput[]
  }

  export type refresh_tokenUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<refresh_tokenCreateWithoutUserInput, refresh_tokenUncheckedCreateWithoutUserInput> | refresh_tokenCreateWithoutUserInput[] | refresh_tokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: refresh_tokenCreateOrConnectWithoutUserInput | refresh_tokenCreateOrConnectWithoutUserInput[]
    createMany?: refresh_tokenCreateManyUserInputEnvelope
    connect?: refresh_tokenWhereUniqueInput | refresh_tokenWhereUniqueInput[]
  }

  export type work_spaceUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<work_spaceCreateWithoutUserInput, work_spaceUncheckedCreateWithoutUserInput> | work_spaceCreateWithoutUserInput[] | work_spaceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: work_spaceCreateOrConnectWithoutUserInput | work_spaceCreateOrConnectWithoutUserInput[]
    createMany?: work_spaceCreateManyUserInputEnvelope
    connect?: work_spaceWhereUniqueInput | work_spaceWhereUniqueInput[]
  }

  export type NullableEnumuser_roleFieldUpdateOperationsInput = {
    set?: $Enums.user_role | null
  }

  export type refresh_tokenUpdateManyWithoutUserNestedInput = {
    create?: XOR<refresh_tokenCreateWithoutUserInput, refresh_tokenUncheckedCreateWithoutUserInput> | refresh_tokenCreateWithoutUserInput[] | refresh_tokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: refresh_tokenCreateOrConnectWithoutUserInput | refresh_tokenCreateOrConnectWithoutUserInput[]
    upsert?: refresh_tokenUpsertWithWhereUniqueWithoutUserInput | refresh_tokenUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: refresh_tokenCreateManyUserInputEnvelope
    set?: refresh_tokenWhereUniqueInput | refresh_tokenWhereUniqueInput[]
    disconnect?: refresh_tokenWhereUniqueInput | refresh_tokenWhereUniqueInput[]
    delete?: refresh_tokenWhereUniqueInput | refresh_tokenWhereUniqueInput[]
    connect?: refresh_tokenWhereUniqueInput | refresh_tokenWhereUniqueInput[]
    update?: refresh_tokenUpdateWithWhereUniqueWithoutUserInput | refresh_tokenUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: refresh_tokenUpdateManyWithWhereWithoutUserInput | refresh_tokenUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: refresh_tokenScalarWhereInput | refresh_tokenScalarWhereInput[]
  }

  export type work_spaceUpdateManyWithoutUserNestedInput = {
    create?: XOR<work_spaceCreateWithoutUserInput, work_spaceUncheckedCreateWithoutUserInput> | work_spaceCreateWithoutUserInput[] | work_spaceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: work_spaceCreateOrConnectWithoutUserInput | work_spaceCreateOrConnectWithoutUserInput[]
    upsert?: work_spaceUpsertWithWhereUniqueWithoutUserInput | work_spaceUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: work_spaceCreateManyUserInputEnvelope
    set?: work_spaceWhereUniqueInput | work_spaceWhereUniqueInput[]
    disconnect?: work_spaceWhereUniqueInput | work_spaceWhereUniqueInput[]
    delete?: work_spaceWhereUniqueInput | work_spaceWhereUniqueInput[]
    connect?: work_spaceWhereUniqueInput | work_spaceWhereUniqueInput[]
    update?: work_spaceUpdateWithWhereUniqueWithoutUserInput | work_spaceUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: work_spaceUpdateManyWithWhereWithoutUserInput | work_spaceUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: work_spaceScalarWhereInput | work_spaceScalarWhereInput[]
  }

  export type refresh_tokenUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<refresh_tokenCreateWithoutUserInput, refresh_tokenUncheckedCreateWithoutUserInput> | refresh_tokenCreateWithoutUserInput[] | refresh_tokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: refresh_tokenCreateOrConnectWithoutUserInput | refresh_tokenCreateOrConnectWithoutUserInput[]
    upsert?: refresh_tokenUpsertWithWhereUniqueWithoutUserInput | refresh_tokenUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: refresh_tokenCreateManyUserInputEnvelope
    set?: refresh_tokenWhereUniqueInput | refresh_tokenWhereUniqueInput[]
    disconnect?: refresh_tokenWhereUniqueInput | refresh_tokenWhereUniqueInput[]
    delete?: refresh_tokenWhereUniqueInput | refresh_tokenWhereUniqueInput[]
    connect?: refresh_tokenWhereUniqueInput | refresh_tokenWhereUniqueInput[]
    update?: refresh_tokenUpdateWithWhereUniqueWithoutUserInput | refresh_tokenUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: refresh_tokenUpdateManyWithWhereWithoutUserInput | refresh_tokenUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: refresh_tokenScalarWhereInput | refresh_tokenScalarWhereInput[]
  }

  export type work_spaceUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<work_spaceCreateWithoutUserInput, work_spaceUncheckedCreateWithoutUserInput> | work_spaceCreateWithoutUserInput[] | work_spaceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: work_spaceCreateOrConnectWithoutUserInput | work_spaceCreateOrConnectWithoutUserInput[]
    upsert?: work_spaceUpsertWithWhereUniqueWithoutUserInput | work_spaceUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: work_spaceCreateManyUserInputEnvelope
    set?: work_spaceWhereUniqueInput | work_spaceWhereUniqueInput[]
    disconnect?: work_spaceWhereUniqueInput | work_spaceWhereUniqueInput[]
    delete?: work_spaceWhereUniqueInput | work_spaceWhereUniqueInput[]
    connect?: work_spaceWhereUniqueInput | work_spaceWhereUniqueInput[]
    update?: work_spaceUpdateWithWhereUniqueWithoutUserInput | work_spaceUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: work_spaceUpdateManyWithWhereWithoutUserInput | work_spaceUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: work_spaceScalarWhereInput | work_spaceScalarWhereInput[]
  }

  export type academic_yearCreateNestedOneWithoutWork_spaceInput = {
    create?: XOR<academic_yearCreateWithoutWork_spaceInput, academic_yearUncheckedCreateWithoutWork_spaceInput>
    connectOrCreate?: academic_yearCreateOrConnectWithoutWork_spaceInput
    connect?: academic_yearWhereUniqueInput
  }

  export type userCreateNestedOneWithoutWork_spaceInput = {
    create?: XOR<userCreateWithoutWork_spaceInput, userUncheckedCreateWithoutWork_spaceInput>
    connectOrCreate?: userCreateOrConnectWithoutWork_spaceInput
    connect?: userWhereUniqueInput
  }

  export type academic_yearUpdateOneWithoutWork_spaceNestedInput = {
    create?: XOR<academic_yearCreateWithoutWork_spaceInput, academic_yearUncheckedCreateWithoutWork_spaceInput>
    connectOrCreate?: academic_yearCreateOrConnectWithoutWork_spaceInput
    upsert?: academic_yearUpsertWithoutWork_spaceInput
    disconnect?: academic_yearWhereInput | boolean
    delete?: academic_yearWhereInput | boolean
    connect?: academic_yearWhereUniqueInput
    update?: XOR<XOR<academic_yearUpdateToOneWithWhereWithoutWork_spaceInput, academic_yearUpdateWithoutWork_spaceInput>, academic_yearUncheckedUpdateWithoutWork_spaceInput>
  }

  export type userUpdateOneWithoutWork_spaceNestedInput = {
    create?: XOR<userCreateWithoutWork_spaceInput, userUncheckedCreateWithoutWork_spaceInput>
    connectOrCreate?: userCreateOrConnectWithoutWork_spaceInput
    upsert?: userUpsertWithoutWork_spaceInput
    disconnect?: userWhereInput | boolean
    delete?: userWhereInput | boolean
    connect?: userWhereUniqueInput
    update?: XOR<XOR<userUpdateToOneWithWhereWithoutWork_spaceInput, userUpdateWithoutWork_spaceInput>, userUncheckedUpdateWithoutWork_spaceInput>
  }

  export type NullableEnumbook_type_statusFieldUpdateOperationsInput = {
    set?: $Enums.book_type_status | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NestedBytesFilter<$PrismaModel = never> = {
    equals?: Uint8Array | BytesFieldRefInput<$PrismaModel>
    in?: Uint8Array[]
    notIn?: Uint8Array[]
    not?: NestedBytesFilter<$PrismaModel> | Uint8Array
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumacademic_year_statusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.academic_year_status | Enumacademic_year_statusFieldRefInput<$PrismaModel> | null
    in?: $Enums.academic_year_status[] | null
    notIn?: $Enums.academic_year_status[] | null
    not?: NestedEnumacademic_year_statusNullableFilter<$PrismaModel> | $Enums.academic_year_status | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBytesWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Uint8Array | BytesFieldRefInput<$PrismaModel>
    in?: Uint8Array[]
    notIn?: Uint8Array[]
    not?: NestedBytesWithAggregatesFilter<$PrismaModel> | Uint8Array
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBytesFilter<$PrismaModel>
    _max?: NestedBytesFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumacademic_year_statusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.academic_year_status | Enumacademic_year_statusFieldRefInput<$PrismaModel> | null
    in?: $Enums.academic_year_status[] | null
    notIn?: $Enums.academic_year_status[] | null
    not?: NestedEnumacademic_year_statusNullableWithAggregatesFilter<$PrismaModel> | $Enums.academic_year_status | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumacademic_year_statusNullableFilter<$PrismaModel>
    _max?: NestedEnumacademic_year_statusNullableFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumbook_statusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.book_status | Enumbook_statusFieldRefInput<$PrismaModel> | null
    in?: $Enums.book_status[] | null
    notIn?: $Enums.book_status[] | null
    not?: NestedEnumbook_statusNullableFilter<$PrismaModel> | $Enums.book_status | null
  }

  export type NestedBigIntNullableFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | null
    notIn?: bigint[] | number[] | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableFilter<$PrismaModel> | bigint | number | null
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedEnumbook_statusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.book_status | Enumbook_statusFieldRefInput<$PrismaModel> | null
    in?: $Enums.book_status[] | null
    notIn?: $Enums.book_status[] | null
    not?: NestedEnumbook_statusNullableWithAggregatesFilter<$PrismaModel> | $Enums.book_status | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumbook_statusNullableFilter<$PrismaModel>
    _max?: NestedEnumbook_statusNullableFilter<$PrismaModel>
  }

  export type NestedBigIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | null
    notIn?: bigint[] | number[] | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableWithAggregatesFilter<$PrismaModel> | bigint | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedBigIntNullableFilter<$PrismaModel>
    _min?: NestedBigIntNullableFilter<$PrismaModel>
    _max?: NestedBigIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumchapter_statusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.chapter_status | Enumchapter_statusFieldRefInput<$PrismaModel> | null
    in?: $Enums.chapter_status[] | null
    notIn?: $Enums.chapter_status[] | null
    not?: NestedEnumchapter_statusNullableFilter<$PrismaModel> | $Enums.chapter_status | null
  }

  export type NestedEnumchapter_statusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.chapter_status | Enumchapter_statusFieldRefInput<$PrismaModel> | null
    in?: $Enums.chapter_status[] | null
    notIn?: $Enums.chapter_status[] | null
    not?: NestedEnumchapter_statusNullableWithAggregatesFilter<$PrismaModel> | $Enums.chapter_status | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumchapter_statusNullableFilter<$PrismaModel>
    _max?: NestedEnumchapter_statusNullableFilter<$PrismaModel>
  }

  export type NestedEnumgrade_statusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.grade_status | Enumgrade_statusFieldRefInput<$PrismaModel> | null
    in?: $Enums.grade_status[] | null
    notIn?: $Enums.grade_status[] | null
    not?: NestedEnumgrade_statusNullableFilter<$PrismaModel> | $Enums.grade_status | null
  }

  export type NestedEnumgrade_statusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.grade_status | Enumgrade_statusFieldRefInput<$PrismaModel> | null
    in?: $Enums.grade_status[] | null
    notIn?: $Enums.grade_status[] | null
    not?: NestedEnumgrade_statusNullableWithAggregatesFilter<$PrismaModel> | $Enums.grade_status | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumgrade_statusNullableFilter<$PrismaModel>
    _max?: NestedEnumgrade_statusNullableFilter<$PrismaModel>
  }

  export type NestedEnumlesson_statusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.lesson_status | Enumlesson_statusFieldRefInput<$PrismaModel> | null
    in?: $Enums.lesson_status[] | null
    notIn?: $Enums.lesson_status[] | null
    not?: NestedEnumlesson_statusNullableFilter<$PrismaModel> | $Enums.lesson_status | null
  }

  export type NestedEnumlesson_statusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.lesson_status | Enumlesson_statusFieldRefInput<$PrismaModel> | null
    in?: $Enums.lesson_status[] | null
    notIn?: $Enums.lesson_status[] | null
    not?: NestedEnumlesson_statusNullableWithAggregatesFilter<$PrismaModel> | $Enums.lesson_status | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumlesson_statusNullableFilter<$PrismaModel>
    _max?: NestedEnumlesson_statusNullableFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBytesNullableFilter<$PrismaModel = never> = {
    equals?: Uint8Array | BytesFieldRefInput<$PrismaModel> | null
    in?: Uint8Array[] | null
    notIn?: Uint8Array[] | null
    not?: NestedBytesNullableFilter<$PrismaModel> | Uint8Array | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedBytesNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Uint8Array | BytesFieldRefInput<$PrismaModel> | null
    in?: Uint8Array[] | null
    notIn?: Uint8Array[] | null
    not?: NestedBytesNullableWithAggregatesFilter<$PrismaModel> | Uint8Array | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBytesNullableFilter<$PrismaModel>
    _max?: NestedBytesNullableFilter<$PrismaModel>
  }

  export type NestedEnumsubject_statusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.subject_status | Enumsubject_statusFieldRefInput<$PrismaModel> | null
    in?: $Enums.subject_status[] | null
    notIn?: $Enums.subject_status[] | null
    not?: NestedEnumsubject_statusNullableFilter<$PrismaModel> | $Enums.subject_status | null
  }

  export type NestedEnumsubject_statusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.subject_status | Enumsubject_statusFieldRefInput<$PrismaModel> | null
    in?: $Enums.subject_status[] | null
    notIn?: $Enums.subject_status[] | null
    not?: NestedEnumsubject_statusNullableWithAggregatesFilter<$PrismaModel> | $Enums.subject_status | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumsubject_statusNullableFilter<$PrismaModel>
    _max?: NestedEnumsubject_statusNullableFilter<$PrismaModel>
  }

  export type NestedEnumuser_roleNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.user_role | Enumuser_roleFieldRefInput<$PrismaModel> | null
    in?: $Enums.user_role[] | null
    notIn?: $Enums.user_role[] | null
    not?: NestedEnumuser_roleNullableFilter<$PrismaModel> | $Enums.user_role | null
  }

  export type NestedEnumuser_roleNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.user_role | Enumuser_roleFieldRefInput<$PrismaModel> | null
    in?: $Enums.user_role[] | null
    notIn?: $Enums.user_role[] | null
    not?: NestedEnumuser_roleNullableWithAggregatesFilter<$PrismaModel> | $Enums.user_role | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumuser_roleNullableFilter<$PrismaModel>
    _max?: NestedEnumuser_roleNullableFilter<$PrismaModel>
  }

  export type NestedEnumbook_type_statusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.book_type_status | Enumbook_type_statusFieldRefInput<$PrismaModel> | null
    in?: $Enums.book_type_status[] | null
    notIn?: $Enums.book_type_status[] | null
    not?: NestedEnumbook_type_statusNullableFilter<$PrismaModel> | $Enums.book_type_status | null
  }

  export type NestedEnumbook_type_statusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.book_type_status | Enumbook_type_statusFieldRefInput<$PrismaModel> | null
    in?: $Enums.book_type_status[] | null
    notIn?: $Enums.book_type_status[] | null
    not?: NestedEnumbook_type_statusNullableWithAggregatesFilter<$PrismaModel> | $Enums.book_type_status | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumbook_type_statusNullableFilter<$PrismaModel>
    _max?: NestedEnumbook_type_statusNullableFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type work_spaceCreateWithoutAcademic_yearInput = {
    id: Uint8Array
    name?: string | null
    user?: userCreateNestedOneWithoutWork_spaceInput
  }

  export type work_spaceUncheckedCreateWithoutAcademic_yearInput = {
    id: Uint8Array
    name?: string | null
    account_id?: Uint8Array | null
  }

  export type work_spaceCreateOrConnectWithoutAcademic_yearInput = {
    where: work_spaceWhereUniqueInput
    create: XOR<work_spaceCreateWithoutAcademic_yearInput, work_spaceUncheckedCreateWithoutAcademic_yearInput>
  }

  export type work_spaceCreateManyAcademic_yearInputEnvelope = {
    data: work_spaceCreateManyAcademic_yearInput | work_spaceCreateManyAcademic_yearInput[]
    skipDuplicates?: boolean
  }

  export type work_spaceUpsertWithWhereUniqueWithoutAcademic_yearInput = {
    where: work_spaceWhereUniqueInput
    update: XOR<work_spaceUpdateWithoutAcademic_yearInput, work_spaceUncheckedUpdateWithoutAcademic_yearInput>
    create: XOR<work_spaceCreateWithoutAcademic_yearInput, work_spaceUncheckedCreateWithoutAcademic_yearInput>
  }

  export type work_spaceUpdateWithWhereUniqueWithoutAcademic_yearInput = {
    where: work_spaceWhereUniqueInput
    data: XOR<work_spaceUpdateWithoutAcademic_yearInput, work_spaceUncheckedUpdateWithoutAcademic_yearInput>
  }

  export type work_spaceUpdateManyWithWhereWithoutAcademic_yearInput = {
    where: work_spaceScalarWhereInput
    data: XOR<work_spaceUpdateManyMutationInput, work_spaceUncheckedUpdateManyWithoutAcademic_yearInput>
  }

  export type work_spaceScalarWhereInput = {
    AND?: work_spaceScalarWhereInput | work_spaceScalarWhereInput[]
    OR?: work_spaceScalarWhereInput[]
    NOT?: work_spaceScalarWhereInput | work_spaceScalarWhereInput[]
    id?: BytesFilter<"work_space"> | Uint8Array
    name?: StringNullableFilter<"work_space"> | string | null
    academic_year_id?: BytesNullableFilter<"work_space"> | Uint8Array | null
    account_id?: BytesNullableFilter<"work_space"> | Uint8Array | null
  }

  export type subjectCreateWithoutBookInput = {
    id?: bigint | number
    created_at?: string | null
    name: string
    status?: $Enums.subject_status | null
    updated_at?: string | null
    grade?: gradeCreateNestedOneWithoutSubjectInput
  }

  export type subjectUncheckedCreateWithoutBookInput = {
    id?: bigint | number
    created_at?: string | null
    name: string
    status?: $Enums.subject_status | null
    updated_at?: string | null
    grade_id?: bigint | number | null
  }

  export type subjectCreateOrConnectWithoutBookInput = {
    where: subjectWhereUniqueInput
    create: XOR<subjectCreateWithoutBookInput, subjectUncheckedCreateWithoutBookInput>
  }

  export type chapterCreateWithoutBookInput = {
    id?: bigint | number
    created_at?: string | null
    name: string
    status?: $Enums.chapter_status | null
    updated_at?: string | null
    lesson?: lessonCreateNestedManyWithoutChapterInput
  }

  export type chapterUncheckedCreateWithoutBookInput = {
    id?: bigint | number
    created_at?: string | null
    name: string
    status?: $Enums.chapter_status | null
    updated_at?: string | null
    lesson?: lessonUncheckedCreateNestedManyWithoutChapterInput
  }

  export type chapterCreateOrConnectWithoutBookInput = {
    where: chapterWhereUniqueInput
    create: XOR<chapterCreateWithoutBookInput, chapterUncheckedCreateWithoutBookInput>
  }

  export type chapterCreateManyBookInputEnvelope = {
    data: chapterCreateManyBookInput | chapterCreateManyBookInput[]
    skipDuplicates?: boolean
  }

  export type subjectUpsertWithoutBookInput = {
    update: XOR<subjectUpdateWithoutBookInput, subjectUncheckedUpdateWithoutBookInput>
    create: XOR<subjectCreateWithoutBookInput, subjectUncheckedCreateWithoutBookInput>
    where?: subjectWhereInput
  }

  export type subjectUpdateToOneWithWhereWithoutBookInput = {
    where?: subjectWhereInput
    data: XOR<subjectUpdateWithoutBookInput, subjectUncheckedUpdateWithoutBookInput>
  }

  export type subjectUpdateWithoutBookInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    status?: NullableEnumsubject_statusFieldUpdateOperationsInput | $Enums.subject_status | null
    updated_at?: NullableStringFieldUpdateOperationsInput | string | null
    grade?: gradeUpdateOneWithoutSubjectNestedInput
  }

  export type subjectUncheckedUpdateWithoutBookInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    status?: NullableEnumsubject_statusFieldUpdateOperationsInput | $Enums.subject_status | null
    updated_at?: NullableStringFieldUpdateOperationsInput | string | null
    grade_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type chapterUpsertWithWhereUniqueWithoutBookInput = {
    where: chapterWhereUniqueInput
    update: XOR<chapterUpdateWithoutBookInput, chapterUncheckedUpdateWithoutBookInput>
    create: XOR<chapterCreateWithoutBookInput, chapterUncheckedCreateWithoutBookInput>
  }

  export type chapterUpdateWithWhereUniqueWithoutBookInput = {
    where: chapterWhereUniqueInput
    data: XOR<chapterUpdateWithoutBookInput, chapterUncheckedUpdateWithoutBookInput>
  }

  export type chapterUpdateManyWithWhereWithoutBookInput = {
    where: chapterScalarWhereInput
    data: XOR<chapterUpdateManyMutationInput, chapterUncheckedUpdateManyWithoutBookInput>
  }

  export type chapterScalarWhereInput = {
    AND?: chapterScalarWhereInput | chapterScalarWhereInput[]
    OR?: chapterScalarWhereInput[]
    NOT?: chapterScalarWhereInput | chapterScalarWhereInput[]
    id?: BigIntFilter<"chapter"> | bigint | number
    created_at?: StringNullableFilter<"chapter"> | string | null
    name?: StringFilter<"chapter"> | string
    status?: Enumchapter_statusNullableFilter<"chapter"> | $Enums.chapter_status | null
    updated_at?: StringNullableFilter<"chapter"> | string | null
    book_id?: BigIntNullableFilter<"chapter"> | bigint | number | null
  }

  export type bookCreateWithoutChapterInput = {
    id?: bigint | number
    created_at?: string | null
    name: string
    status?: $Enums.book_status | null
    updated_at?: string | null
    subject?: subjectCreateNestedOneWithoutBookInput
  }

  export type bookUncheckedCreateWithoutChapterInput = {
    id?: bigint | number
    created_at?: string | null
    name: string
    status?: $Enums.book_status | null
    updated_at?: string | null
    subject_id?: bigint | number | null
  }

  export type bookCreateOrConnectWithoutChapterInput = {
    where: bookWhereUniqueInput
    create: XOR<bookCreateWithoutChapterInput, bookUncheckedCreateWithoutChapterInput>
  }

  export type lessonCreateWithoutChapterInput = {
    id?: bigint | number
    created_at?: string | null
    name: string
    status?: $Enums.lesson_status | null
    updated_at?: string | null
  }

  export type lessonUncheckedCreateWithoutChapterInput = {
    id?: bigint | number
    created_at?: string | null
    name: string
    status?: $Enums.lesson_status | null
    updated_at?: string | null
  }

  export type lessonCreateOrConnectWithoutChapterInput = {
    where: lessonWhereUniqueInput
    create: XOR<lessonCreateWithoutChapterInput, lessonUncheckedCreateWithoutChapterInput>
  }

  export type lessonCreateManyChapterInputEnvelope = {
    data: lessonCreateManyChapterInput | lessonCreateManyChapterInput[]
    skipDuplicates?: boolean
  }

  export type bookUpsertWithoutChapterInput = {
    update: XOR<bookUpdateWithoutChapterInput, bookUncheckedUpdateWithoutChapterInput>
    create: XOR<bookCreateWithoutChapterInput, bookUncheckedCreateWithoutChapterInput>
    where?: bookWhereInput
  }

  export type bookUpdateToOneWithWhereWithoutChapterInput = {
    where?: bookWhereInput
    data: XOR<bookUpdateWithoutChapterInput, bookUncheckedUpdateWithoutChapterInput>
  }

  export type bookUpdateWithoutChapterInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    status?: NullableEnumbook_statusFieldUpdateOperationsInput | $Enums.book_status | null
    updated_at?: NullableStringFieldUpdateOperationsInput | string | null
    subject?: subjectUpdateOneWithoutBookNestedInput
  }

  export type bookUncheckedUpdateWithoutChapterInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    status?: NullableEnumbook_statusFieldUpdateOperationsInput | $Enums.book_status | null
    updated_at?: NullableStringFieldUpdateOperationsInput | string | null
    subject_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type lessonUpsertWithWhereUniqueWithoutChapterInput = {
    where: lessonWhereUniqueInput
    update: XOR<lessonUpdateWithoutChapterInput, lessonUncheckedUpdateWithoutChapterInput>
    create: XOR<lessonCreateWithoutChapterInput, lessonUncheckedCreateWithoutChapterInput>
  }

  export type lessonUpdateWithWhereUniqueWithoutChapterInput = {
    where: lessonWhereUniqueInput
    data: XOR<lessonUpdateWithoutChapterInput, lessonUncheckedUpdateWithoutChapterInput>
  }

  export type lessonUpdateManyWithWhereWithoutChapterInput = {
    where: lessonScalarWhereInput
    data: XOR<lessonUpdateManyMutationInput, lessonUncheckedUpdateManyWithoutChapterInput>
  }

  export type lessonScalarWhereInput = {
    AND?: lessonScalarWhereInput | lessonScalarWhereInput[]
    OR?: lessonScalarWhereInput[]
    NOT?: lessonScalarWhereInput | lessonScalarWhereInput[]
    id?: BigIntFilter<"lesson"> | bigint | number
    created_at?: StringNullableFilter<"lesson"> | string | null
    name?: StringFilter<"lesson"> | string
    status?: Enumlesson_statusNullableFilter<"lesson"> | $Enums.lesson_status | null
    updated_at?: StringNullableFilter<"lesson"> | string | null
    chapter_id?: BigIntNullableFilter<"lesson"> | bigint | number | null
  }

  export type subjectCreateWithoutGradeInput = {
    id?: bigint | number
    created_at?: string | null
    name: string
    status?: $Enums.subject_status | null
    updated_at?: string | null
    book?: bookCreateNestedManyWithoutSubjectInput
  }

  export type subjectUncheckedCreateWithoutGradeInput = {
    id?: bigint | number
    created_at?: string | null
    name: string
    status?: $Enums.subject_status | null
    updated_at?: string | null
    book?: bookUncheckedCreateNestedManyWithoutSubjectInput
  }

  export type subjectCreateOrConnectWithoutGradeInput = {
    where: subjectWhereUniqueInput
    create: XOR<subjectCreateWithoutGradeInput, subjectUncheckedCreateWithoutGradeInput>
  }

  export type subjectCreateManyGradeInputEnvelope = {
    data: subjectCreateManyGradeInput | subjectCreateManyGradeInput[]
    skipDuplicates?: boolean
  }

  export type subjectUpsertWithWhereUniqueWithoutGradeInput = {
    where: subjectWhereUniqueInput
    update: XOR<subjectUpdateWithoutGradeInput, subjectUncheckedUpdateWithoutGradeInput>
    create: XOR<subjectCreateWithoutGradeInput, subjectUncheckedCreateWithoutGradeInput>
  }

  export type subjectUpdateWithWhereUniqueWithoutGradeInput = {
    where: subjectWhereUniqueInput
    data: XOR<subjectUpdateWithoutGradeInput, subjectUncheckedUpdateWithoutGradeInput>
  }

  export type subjectUpdateManyWithWhereWithoutGradeInput = {
    where: subjectScalarWhereInput
    data: XOR<subjectUpdateManyMutationInput, subjectUncheckedUpdateManyWithoutGradeInput>
  }

  export type subjectScalarWhereInput = {
    AND?: subjectScalarWhereInput | subjectScalarWhereInput[]
    OR?: subjectScalarWhereInput[]
    NOT?: subjectScalarWhereInput | subjectScalarWhereInput[]
    id?: BigIntFilter<"subject"> | bigint | number
    created_at?: StringNullableFilter<"subject"> | string | null
    name?: StringFilter<"subject"> | string
    status?: Enumsubject_statusNullableFilter<"subject"> | $Enums.subject_status | null
    updated_at?: StringNullableFilter<"subject"> | string | null
    grade_id?: BigIntNullableFilter<"subject"> | bigint | number | null
  }

  export type chapterCreateWithoutLessonInput = {
    id?: bigint | number
    created_at?: string | null
    name: string
    status?: $Enums.chapter_status | null
    updated_at?: string | null
    book?: bookCreateNestedOneWithoutChapterInput
  }

  export type chapterUncheckedCreateWithoutLessonInput = {
    id?: bigint | number
    created_at?: string | null
    name: string
    status?: $Enums.chapter_status | null
    updated_at?: string | null
    book_id?: bigint | number | null
  }

  export type chapterCreateOrConnectWithoutLessonInput = {
    where: chapterWhereUniqueInput
    create: XOR<chapterCreateWithoutLessonInput, chapterUncheckedCreateWithoutLessonInput>
  }

  export type chapterUpsertWithoutLessonInput = {
    update: XOR<chapterUpdateWithoutLessonInput, chapterUncheckedUpdateWithoutLessonInput>
    create: XOR<chapterCreateWithoutLessonInput, chapterUncheckedCreateWithoutLessonInput>
    where?: chapterWhereInput
  }

  export type chapterUpdateToOneWithWhereWithoutLessonInput = {
    where?: chapterWhereInput
    data: XOR<chapterUpdateWithoutLessonInput, chapterUncheckedUpdateWithoutLessonInput>
  }

  export type chapterUpdateWithoutLessonInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    status?: NullableEnumchapter_statusFieldUpdateOperationsInput | $Enums.chapter_status | null
    updated_at?: NullableStringFieldUpdateOperationsInput | string | null
    book?: bookUpdateOneWithoutChapterNestedInput
  }

  export type chapterUncheckedUpdateWithoutLessonInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    status?: NullableEnumchapter_statusFieldUpdateOperationsInput | $Enums.chapter_status | null
    updated_at?: NullableStringFieldUpdateOperationsInput | string | null
    book_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type userCreateWithoutRefresh_tokenInput = {
    id: Uint8Array
    email?: string | null
    full_name?: string | null
    password?: string | null
    role?: $Enums.user_role | null
    username?: string | null
    work_space?: work_spaceCreateNestedManyWithoutUserInput
  }

  export type userUncheckedCreateWithoutRefresh_tokenInput = {
    id: Uint8Array
    email?: string | null
    full_name?: string | null
    password?: string | null
    role?: $Enums.user_role | null
    username?: string | null
    work_space?: work_spaceUncheckedCreateNestedManyWithoutUserInput
  }

  export type userCreateOrConnectWithoutRefresh_tokenInput = {
    where: userWhereUniqueInput
    create: XOR<userCreateWithoutRefresh_tokenInput, userUncheckedCreateWithoutRefresh_tokenInput>
  }

  export type userUpsertWithoutRefresh_tokenInput = {
    update: XOR<userUpdateWithoutRefresh_tokenInput, userUncheckedUpdateWithoutRefresh_tokenInput>
    create: XOR<userCreateWithoutRefresh_tokenInput, userUncheckedCreateWithoutRefresh_tokenInput>
    where?: userWhereInput
  }

  export type userUpdateToOneWithWhereWithoutRefresh_tokenInput = {
    where?: userWhereInput
    data: XOR<userUpdateWithoutRefresh_tokenInput, userUncheckedUpdateWithoutRefresh_tokenInput>
  }

  export type userUpdateWithoutRefresh_tokenInput = {
    id?: BytesFieldUpdateOperationsInput | Uint8Array
    email?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableEnumuser_roleFieldUpdateOperationsInput | $Enums.user_role | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    work_space?: work_spaceUpdateManyWithoutUserNestedInput
  }

  export type userUncheckedUpdateWithoutRefresh_tokenInput = {
    id?: BytesFieldUpdateOperationsInput | Uint8Array
    email?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableEnumuser_roleFieldUpdateOperationsInput | $Enums.user_role | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    work_space?: work_spaceUncheckedUpdateManyWithoutUserNestedInput
  }

  export type bookCreateWithoutSubjectInput = {
    id?: bigint | number
    created_at?: string | null
    name: string
    status?: $Enums.book_status | null
    updated_at?: string | null
    chapter?: chapterCreateNestedManyWithoutBookInput
  }

  export type bookUncheckedCreateWithoutSubjectInput = {
    id?: bigint | number
    created_at?: string | null
    name: string
    status?: $Enums.book_status | null
    updated_at?: string | null
    chapter?: chapterUncheckedCreateNestedManyWithoutBookInput
  }

  export type bookCreateOrConnectWithoutSubjectInput = {
    where: bookWhereUniqueInput
    create: XOR<bookCreateWithoutSubjectInput, bookUncheckedCreateWithoutSubjectInput>
  }

  export type bookCreateManySubjectInputEnvelope = {
    data: bookCreateManySubjectInput | bookCreateManySubjectInput[]
    skipDuplicates?: boolean
  }

  export type gradeCreateWithoutSubjectInput = {
    id?: bigint | number
    created_at?: string | null
    name: string
    status?: $Enums.grade_status | null
    updated_at?: string | null
  }

  export type gradeUncheckedCreateWithoutSubjectInput = {
    id?: bigint | number
    created_at?: string | null
    name: string
    status?: $Enums.grade_status | null
    updated_at?: string | null
  }

  export type gradeCreateOrConnectWithoutSubjectInput = {
    where: gradeWhereUniqueInput
    create: XOR<gradeCreateWithoutSubjectInput, gradeUncheckedCreateWithoutSubjectInput>
  }

  export type bookUpsertWithWhereUniqueWithoutSubjectInput = {
    where: bookWhereUniqueInput
    update: XOR<bookUpdateWithoutSubjectInput, bookUncheckedUpdateWithoutSubjectInput>
    create: XOR<bookCreateWithoutSubjectInput, bookUncheckedCreateWithoutSubjectInput>
  }

  export type bookUpdateWithWhereUniqueWithoutSubjectInput = {
    where: bookWhereUniqueInput
    data: XOR<bookUpdateWithoutSubjectInput, bookUncheckedUpdateWithoutSubjectInput>
  }

  export type bookUpdateManyWithWhereWithoutSubjectInput = {
    where: bookScalarWhereInput
    data: XOR<bookUpdateManyMutationInput, bookUncheckedUpdateManyWithoutSubjectInput>
  }

  export type bookScalarWhereInput = {
    AND?: bookScalarWhereInput | bookScalarWhereInput[]
    OR?: bookScalarWhereInput[]
    NOT?: bookScalarWhereInput | bookScalarWhereInput[]
    id?: BigIntFilter<"book"> | bigint | number
    created_at?: StringNullableFilter<"book"> | string | null
    name?: StringFilter<"book"> | string
    status?: Enumbook_statusNullableFilter<"book"> | $Enums.book_status | null
    updated_at?: StringNullableFilter<"book"> | string | null
    subject_id?: BigIntNullableFilter<"book"> | bigint | number | null
  }

  export type gradeUpsertWithoutSubjectInput = {
    update: XOR<gradeUpdateWithoutSubjectInput, gradeUncheckedUpdateWithoutSubjectInput>
    create: XOR<gradeCreateWithoutSubjectInput, gradeUncheckedCreateWithoutSubjectInput>
    where?: gradeWhereInput
  }

  export type gradeUpdateToOneWithWhereWithoutSubjectInput = {
    where?: gradeWhereInput
    data: XOR<gradeUpdateWithoutSubjectInput, gradeUncheckedUpdateWithoutSubjectInput>
  }

  export type gradeUpdateWithoutSubjectInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    status?: NullableEnumgrade_statusFieldUpdateOperationsInput | $Enums.grade_status | null
    updated_at?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type gradeUncheckedUpdateWithoutSubjectInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    status?: NullableEnumgrade_statusFieldUpdateOperationsInput | $Enums.grade_status | null
    updated_at?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type refresh_tokenCreateWithoutUserInput = {
    id?: bigint | number
    expires_at?: Date | string | null
    is_revoked: boolean
    issued_at?: Date | string | null
    token?: string | null
  }

  export type refresh_tokenUncheckedCreateWithoutUserInput = {
    id?: bigint | number
    expires_at?: Date | string | null
    is_revoked: boolean
    issued_at?: Date | string | null
    token?: string | null
  }

  export type refresh_tokenCreateOrConnectWithoutUserInput = {
    where: refresh_tokenWhereUniqueInput
    create: XOR<refresh_tokenCreateWithoutUserInput, refresh_tokenUncheckedCreateWithoutUserInput>
  }

  export type refresh_tokenCreateManyUserInputEnvelope = {
    data: refresh_tokenCreateManyUserInput | refresh_tokenCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type work_spaceCreateWithoutUserInput = {
    id: Uint8Array
    name?: string | null
    academic_year?: academic_yearCreateNestedOneWithoutWork_spaceInput
  }

  export type work_spaceUncheckedCreateWithoutUserInput = {
    id: Uint8Array
    name?: string | null
    academic_year_id?: Uint8Array | null
  }

  export type work_spaceCreateOrConnectWithoutUserInput = {
    where: work_spaceWhereUniqueInput
    create: XOR<work_spaceCreateWithoutUserInput, work_spaceUncheckedCreateWithoutUserInput>
  }

  export type work_spaceCreateManyUserInputEnvelope = {
    data: work_spaceCreateManyUserInput | work_spaceCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type refresh_tokenUpsertWithWhereUniqueWithoutUserInput = {
    where: refresh_tokenWhereUniqueInput
    update: XOR<refresh_tokenUpdateWithoutUserInput, refresh_tokenUncheckedUpdateWithoutUserInput>
    create: XOR<refresh_tokenCreateWithoutUserInput, refresh_tokenUncheckedCreateWithoutUserInput>
  }

  export type refresh_tokenUpdateWithWhereUniqueWithoutUserInput = {
    where: refresh_tokenWhereUniqueInput
    data: XOR<refresh_tokenUpdateWithoutUserInput, refresh_tokenUncheckedUpdateWithoutUserInput>
  }

  export type refresh_tokenUpdateManyWithWhereWithoutUserInput = {
    where: refresh_tokenScalarWhereInput
    data: XOR<refresh_tokenUpdateManyMutationInput, refresh_tokenUncheckedUpdateManyWithoutUserInput>
  }

  export type refresh_tokenScalarWhereInput = {
    AND?: refresh_tokenScalarWhereInput | refresh_tokenScalarWhereInput[]
    OR?: refresh_tokenScalarWhereInput[]
    NOT?: refresh_tokenScalarWhereInput | refresh_tokenScalarWhereInput[]
    id?: BigIntFilter<"refresh_token"> | bigint | number
    expires_at?: DateTimeNullableFilter<"refresh_token"> | Date | string | null
    is_revoked?: BoolFilter<"refresh_token"> | boolean
    issued_at?: DateTimeNullableFilter<"refresh_token"> | Date | string | null
    token?: StringNullableFilter<"refresh_token"> | string | null
    user_id?: BytesNullableFilter<"refresh_token"> | Uint8Array | null
  }

  export type work_spaceUpsertWithWhereUniqueWithoutUserInput = {
    where: work_spaceWhereUniqueInput
    update: XOR<work_spaceUpdateWithoutUserInput, work_spaceUncheckedUpdateWithoutUserInput>
    create: XOR<work_spaceCreateWithoutUserInput, work_spaceUncheckedCreateWithoutUserInput>
  }

  export type work_spaceUpdateWithWhereUniqueWithoutUserInput = {
    where: work_spaceWhereUniqueInput
    data: XOR<work_spaceUpdateWithoutUserInput, work_spaceUncheckedUpdateWithoutUserInput>
  }

  export type work_spaceUpdateManyWithWhereWithoutUserInput = {
    where: work_spaceScalarWhereInput
    data: XOR<work_spaceUpdateManyMutationInput, work_spaceUncheckedUpdateManyWithoutUserInput>
  }

  export type academic_yearCreateWithoutWork_spaceInput = {
    id: Uint8Array
    created_at?: Date | string | null
    end_date?: Date | string | null
    start_date?: Date | string | null
    status?: $Enums.academic_year_status | null
    updated_at?: Date | string | null
    year_label?: string | null
  }

  export type academic_yearUncheckedCreateWithoutWork_spaceInput = {
    id: Uint8Array
    created_at?: Date | string | null
    end_date?: Date | string | null
    start_date?: Date | string | null
    status?: $Enums.academic_year_status | null
    updated_at?: Date | string | null
    year_label?: string | null
  }

  export type academic_yearCreateOrConnectWithoutWork_spaceInput = {
    where: academic_yearWhereUniqueInput
    create: XOR<academic_yearCreateWithoutWork_spaceInput, academic_yearUncheckedCreateWithoutWork_spaceInput>
  }

  export type userCreateWithoutWork_spaceInput = {
    id: Uint8Array
    email?: string | null
    full_name?: string | null
    password?: string | null
    role?: $Enums.user_role | null
    username?: string | null
    refresh_token?: refresh_tokenCreateNestedManyWithoutUserInput
  }

  export type userUncheckedCreateWithoutWork_spaceInput = {
    id: Uint8Array
    email?: string | null
    full_name?: string | null
    password?: string | null
    role?: $Enums.user_role | null
    username?: string | null
    refresh_token?: refresh_tokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type userCreateOrConnectWithoutWork_spaceInput = {
    where: userWhereUniqueInput
    create: XOR<userCreateWithoutWork_spaceInput, userUncheckedCreateWithoutWork_spaceInput>
  }

  export type academic_yearUpsertWithoutWork_spaceInput = {
    update: XOR<academic_yearUpdateWithoutWork_spaceInput, academic_yearUncheckedUpdateWithoutWork_spaceInput>
    create: XOR<academic_yearCreateWithoutWork_spaceInput, academic_yearUncheckedCreateWithoutWork_spaceInput>
    where?: academic_yearWhereInput
  }

  export type academic_yearUpdateToOneWithWhereWithoutWork_spaceInput = {
    where?: academic_yearWhereInput
    data: XOR<academic_yearUpdateWithoutWork_spaceInput, academic_yearUncheckedUpdateWithoutWork_spaceInput>
  }

  export type academic_yearUpdateWithoutWork_spaceInput = {
    id?: BytesFieldUpdateOperationsInput | Uint8Array
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: NullableEnumacademic_year_statusFieldUpdateOperationsInput | $Enums.academic_year_status | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    year_label?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type academic_yearUncheckedUpdateWithoutWork_spaceInput = {
    id?: BytesFieldUpdateOperationsInput | Uint8Array
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: NullableEnumacademic_year_statusFieldUpdateOperationsInput | $Enums.academic_year_status | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    year_label?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type userUpsertWithoutWork_spaceInput = {
    update: XOR<userUpdateWithoutWork_spaceInput, userUncheckedUpdateWithoutWork_spaceInput>
    create: XOR<userCreateWithoutWork_spaceInput, userUncheckedCreateWithoutWork_spaceInput>
    where?: userWhereInput
  }

  export type userUpdateToOneWithWhereWithoutWork_spaceInput = {
    where?: userWhereInput
    data: XOR<userUpdateWithoutWork_spaceInput, userUncheckedUpdateWithoutWork_spaceInput>
  }

  export type userUpdateWithoutWork_spaceInput = {
    id?: BytesFieldUpdateOperationsInput | Uint8Array
    email?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableEnumuser_roleFieldUpdateOperationsInput | $Enums.user_role | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    refresh_token?: refresh_tokenUpdateManyWithoutUserNestedInput
  }

  export type userUncheckedUpdateWithoutWork_spaceInput = {
    id?: BytesFieldUpdateOperationsInput | Uint8Array
    email?: NullableStringFieldUpdateOperationsInput | string | null
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableEnumuser_roleFieldUpdateOperationsInput | $Enums.user_role | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    refresh_token?: refresh_tokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type work_spaceCreateManyAcademic_yearInput = {
    id: Uint8Array
    name?: string | null
    account_id?: Uint8Array | null
  }

  export type work_spaceUpdateWithoutAcademic_yearInput = {
    id?: BytesFieldUpdateOperationsInput | Uint8Array
    name?: NullableStringFieldUpdateOperationsInput | string | null
    user?: userUpdateOneWithoutWork_spaceNestedInput
  }

  export type work_spaceUncheckedUpdateWithoutAcademic_yearInput = {
    id?: BytesFieldUpdateOperationsInput | Uint8Array
    name?: NullableStringFieldUpdateOperationsInput | string | null
    account_id?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
  }

  export type work_spaceUncheckedUpdateManyWithoutAcademic_yearInput = {
    id?: BytesFieldUpdateOperationsInput | Uint8Array
    name?: NullableStringFieldUpdateOperationsInput | string | null
    account_id?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
  }

  export type chapterCreateManyBookInput = {
    id?: bigint | number
    created_at?: string | null
    name: string
    status?: $Enums.chapter_status | null
    updated_at?: string | null
  }

  export type chapterUpdateWithoutBookInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    status?: NullableEnumchapter_statusFieldUpdateOperationsInput | $Enums.chapter_status | null
    updated_at?: NullableStringFieldUpdateOperationsInput | string | null
    lesson?: lessonUpdateManyWithoutChapterNestedInput
  }

  export type chapterUncheckedUpdateWithoutBookInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    status?: NullableEnumchapter_statusFieldUpdateOperationsInput | $Enums.chapter_status | null
    updated_at?: NullableStringFieldUpdateOperationsInput | string | null
    lesson?: lessonUncheckedUpdateManyWithoutChapterNestedInput
  }

  export type chapterUncheckedUpdateManyWithoutBookInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    status?: NullableEnumchapter_statusFieldUpdateOperationsInput | $Enums.chapter_status | null
    updated_at?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type lessonCreateManyChapterInput = {
    id?: bigint | number
    created_at?: string | null
    name: string
    status?: $Enums.lesson_status | null
    updated_at?: string | null
  }

  export type lessonUpdateWithoutChapterInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    status?: NullableEnumlesson_statusFieldUpdateOperationsInput | $Enums.lesson_status | null
    updated_at?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type lessonUncheckedUpdateWithoutChapterInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    status?: NullableEnumlesson_statusFieldUpdateOperationsInput | $Enums.lesson_status | null
    updated_at?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type lessonUncheckedUpdateManyWithoutChapterInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    status?: NullableEnumlesson_statusFieldUpdateOperationsInput | $Enums.lesson_status | null
    updated_at?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type subjectCreateManyGradeInput = {
    id?: bigint | number
    created_at?: string | null
    name: string
    status?: $Enums.subject_status | null
    updated_at?: string | null
  }

  export type subjectUpdateWithoutGradeInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    status?: NullableEnumsubject_statusFieldUpdateOperationsInput | $Enums.subject_status | null
    updated_at?: NullableStringFieldUpdateOperationsInput | string | null
    book?: bookUpdateManyWithoutSubjectNestedInput
  }

  export type subjectUncheckedUpdateWithoutGradeInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    status?: NullableEnumsubject_statusFieldUpdateOperationsInput | $Enums.subject_status | null
    updated_at?: NullableStringFieldUpdateOperationsInput | string | null
    book?: bookUncheckedUpdateManyWithoutSubjectNestedInput
  }

  export type subjectUncheckedUpdateManyWithoutGradeInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    status?: NullableEnumsubject_statusFieldUpdateOperationsInput | $Enums.subject_status | null
    updated_at?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type bookCreateManySubjectInput = {
    id?: bigint | number
    created_at?: string | null
    name: string
    status?: $Enums.book_status | null
    updated_at?: string | null
  }

  export type bookUpdateWithoutSubjectInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    status?: NullableEnumbook_statusFieldUpdateOperationsInput | $Enums.book_status | null
    updated_at?: NullableStringFieldUpdateOperationsInput | string | null
    chapter?: chapterUpdateManyWithoutBookNestedInput
  }

  export type bookUncheckedUpdateWithoutSubjectInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    status?: NullableEnumbook_statusFieldUpdateOperationsInput | $Enums.book_status | null
    updated_at?: NullableStringFieldUpdateOperationsInput | string | null
    chapter?: chapterUncheckedUpdateManyWithoutBookNestedInput
  }

  export type bookUncheckedUpdateManyWithoutSubjectInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    status?: NullableEnumbook_statusFieldUpdateOperationsInput | $Enums.book_status | null
    updated_at?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type refresh_tokenCreateManyUserInput = {
    id?: bigint | number
    expires_at?: Date | string | null
    is_revoked: boolean
    issued_at?: Date | string | null
    token?: string | null
  }

  export type work_spaceCreateManyUserInput = {
    id: Uint8Array
    name?: string | null
    academic_year_id?: Uint8Array | null
  }

  export type refresh_tokenUpdateWithoutUserInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_revoked?: BoolFieldUpdateOperationsInput | boolean
    issued_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    token?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type refresh_tokenUncheckedUpdateWithoutUserInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_revoked?: BoolFieldUpdateOperationsInput | boolean
    issued_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    token?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type refresh_tokenUncheckedUpdateManyWithoutUserInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_revoked?: BoolFieldUpdateOperationsInput | boolean
    issued_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    token?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type work_spaceUpdateWithoutUserInput = {
    id?: BytesFieldUpdateOperationsInput | Uint8Array
    name?: NullableStringFieldUpdateOperationsInput | string | null
    academic_year?: academic_yearUpdateOneWithoutWork_spaceNestedInput
  }

  export type work_spaceUncheckedUpdateWithoutUserInput = {
    id?: BytesFieldUpdateOperationsInput | Uint8Array
    name?: NullableStringFieldUpdateOperationsInput | string | null
    academic_year_id?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
  }

  export type work_spaceUncheckedUpdateManyWithoutUserInput = {
    id?: BytesFieldUpdateOperationsInput | Uint8Array
    name?: NullableStringFieldUpdateOperationsInput | string | null
    academic_year_id?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}