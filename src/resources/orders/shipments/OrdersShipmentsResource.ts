import { CreateParameters, GetParameters, ListParameters, UpdateParameters } from './parameters';
import ApiError from '../../../errors/ApiError';
import Callback from '../../../types/Callback';
import List from '../../../data/list/List';
import ParentedResource from '../../ParentedResource';
import Shipment, { ShipmentData, injectPrototypes } from '../../../data/orders/shipments/Shipment';
import checkId from '../../../plumbing/checkId';
import renege from '../../../plumbing/renege';

export default class OrdersShipmentsResource extends ParentedResource<ShipmentData, Shipment> {
  protected getResourceUrl(orderId: string): string {
    return `orders/${orderId}/shipments`;
  }

  protected injectPrototypes = injectPrototypes;

  /**
   * List order shipments
   *
   * @since 3.0.0
   *
   * @see https://docs.mollie.com/reference/v2/shipments-api/list-shipments
   */
  public all: OrdersShipmentsResource['list'] = this.list;
  /**
   * List order shipments
   *
   * @since 3.0.0
   *
   * @see https://docs.mollie.com/reference/v2/shipments-api/list-shipments
   */
  public page: OrdersShipmentsResource['list'] = this.list;

  /**
   * In addition to the
   * {@link https://docs.mollie.com/reference/v2/orders-api/create-order Orders API},
   * the create shipment endpoint can be used to ship order lines.
   *
   * When using Klarna Pay later and Klarna Slice it this is mandatory
   * for the order amount to be captured. An capture will automatically
   * be created for the shipment.
   *
   * The word “shipping” is used in the figurative sense here. It can also
   * mean that a service was provided or digital content was delivered.
   *
   * @since 3.0.0
   *
   * @see https://docs.mollie.com/reference/v2/shipments-api/create-shipment
   */
  public create(parameters: CreateParameters): Promise<Shipment>;
  public create(parameters: CreateParameters, callback: Callback<Shipment>): void;
  public create(parameters: CreateParameters) {
    if (renege(this, this.create, ...arguments)) return;
    const orderId = this.getParentId(parameters.orderId);
    if (!checkId(orderId, 'order')) {
      throw new ApiError('The order id is invalid');
    }
    const { orderId: _, ...data } = parameters;
    return this.network.post(this.getResourceUrl(orderId), data);
  }

  /**
   * Get a Shipment by ID
   *
   * @since 3.0.0
   *
   * @see https://docs.mollie.com/reference/v2/shipments-api/get-shipment
   */
  public get(id: string, parameters: GetParameters): Promise<Shipment>;
  public get(id: string, parameters: GetParameters, callback: Callback<Shipment>): void;
  public get(id: string, parameters: GetParameters) {
    if (renege(this, this.get, ...arguments)) return;
    if (!checkId(id, 'shipment')) {
      throw new ApiError('The orders_shipments id is invalid');
    }
    // parameters || {} is used here, because in case withParent is used, parameters could be omitted.
    const orderId = this.getParentId((parameters || {}).orderId);
    if (!checkId(orderId, 'order')) {
      throw new ApiError('The order id is invalid');
    }
    const { orderId: _, ...query } = parameters || {};
    return this.network.get(`${this.getResourceUrl(orderId)}/${id}`, query);
  }

  /**
   * Update a Shipment
   *
   * @since 3.0.0
   *
   * @see https://docs.mollie.com/reference/v2/shipments-api/update-shipment
   */
  public update(id: string, parameters: UpdateParameters): Promise<Shipment>;
  public update(id: string, parameters: UpdateParameters, callback: Callback<Shipment>): void;
  public update(id: string, parameters: UpdateParameters) {
    if (renege(this, this.update, ...arguments)) return;
    if (!checkId(id, 'shipment')) {
      throw new ApiError('The orders_shipments id is invalid');
    }
    const orderId = this.getParentId(parameters.orderId);
    if (!checkId(orderId, 'order')) {
      throw new ApiError('The order id is invalid');
    }
    const { orderId: _, ...data } = parameters;
    return this.network.patch(`${this.getResourceUrl(orderId)}/${id}`, data);
  }

  /**
   * List order shipments
   *
   * @since 3.0.0
   *
   * @see https://docs.mollie.com/reference/v2/shipments-api/list-shipments
   */
  public list(parameters: ListParameters): Promise<List<Shipment>>;
  public list(parameters: ListParameters, callback: Callback<List<Shipment>>): void;
  public list(parameters: ListParameters) {
    if (renege(this, this.list, ...arguments)) return;
    // parameters || {} is used here, because in case withParent is used, parameters could be omitted.
    const orderId = this.getParentId((parameters || {}).orderId);
    if (!checkId(orderId, 'order')) {
      throw new ApiError('The order id is invalid');
    }
    const { orderId: _, ...query } = parameters || {};
    return this.network.list(this.getResourceUrl(orderId), 'shipments', query).then(result => this.injectPaginationHelpers(result, this.list, parameters));
  }
}
