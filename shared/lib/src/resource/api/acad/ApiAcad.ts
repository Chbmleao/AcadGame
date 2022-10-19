/**
 * @category API
 * @module ApiAcad
 */

/** Enums */
import {
  HttpContentTypeEnum,
  HttpMethodEnum,
  HttpRequestHeaderEnum,
} from '../../../utils/classes/api-client/ApiClientEnums';

/** Interfaces */
import { IApiAcadAuthResponse } from './ApiAcadInterfaces';
import { IApiClientRequestParams } from '../../../utils/classes/api-client/ApiClientInterfaces';

/** Classes */
import { ApiClient } from '../../../utils/classes/api-client/ApiClient';
import { ApiAcadEndpoint } from './ApiAcadEndpoint';

/**
 * AcadGame's API class.
 */
export class ApiAcad extends ApiClient {
  #api: ApiAcadEndpoint;

  constructor(baseUrl: string) {
    super(baseUrl);
    this.#api = new ApiAcadEndpoint(this, { uri: '/api' });
  }

  /**
   * Returns the HTTP Headers object to be used on requests.
   *
   * @returns - The headers object for API requests
   */
  get headers(): Headers {
    const headersExtension = {
      [HttpRequestHeaderEnum.ACCEPT]: [
        HttpContentTypeEnum.JSON,
        HttpContentTypeEnum.TEXT,
        HttpContentTypeEnum.ALL,
      ].join(', '),
    };
    return new Headers(
      Object.assign(
        Object.fromEntries(super.headers.entries()),
        headersExtension
      )
    );
  }

  /**
   * Fetches the API providing a user and password payload.
   *
   * @param username - The username of the user being authenticated
   * @param password - The password of the user being authenticated
   * @returns - The JWT token when user is authenticated
   */
  async login(
    username: string,
    password: string
  ): Promise<IApiAcadAuthResponse> {
    const requestParams: IApiClientRequestParams = {
      body: {
        username,
        password,
      },
      method: HttpMethodEnum.POST,
    };
    const response = this.#api.request('/auth', requestParams);
    const responseData = await response.promise;
    const loginResponse = responseData.data as IApiAcadAuthResponse;

    return loginResponse;
  }
}
