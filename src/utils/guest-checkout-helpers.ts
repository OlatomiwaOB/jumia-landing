import { GuestInfo } from "@/store/guestCheckoutStore";
import { getNationalityName } from "./country-data";

/**
 * Wraps a standard order payload into the guest checkout format.
 * The backend expects personal info at the top level and order data nested in `oinfo`.
 */
export function buildGuestOrderPayload(guestInfo: GuestInfo, orderPayload: any): any {
  return {
    firstname: guestInfo.firstname,
    channel: 'WEB',
    lastname: guestInfo.lastname,
    mobileNo: guestInfo.mobileNo,
    email: guestInfo.email,
    city: guestInfo.city,
    countryCode: guestInfo.countryCode,
    gender: guestInfo.gender || '',
    dateOfBirth: guestInfo.dateOfBirth || '',
    password: guestInfo.password,
    nationality: getNationalityName(guestInfo.nationality),
    customerType: guestInfo.customerType || 'CUSTOMER',
    deviceId: orderPayload.deviceId || '',
    geolocation: orderPayload.geolocation || '',
    oinfo: {
      ...orderPayload,
      deliveryAddress: {
        ...(orderPayload.deliveryAddress || {}),
        id: 0
      },
      customerName: `${guestInfo.firstname} ${guestInfo.lastname}`,
      username: guestInfo.email,
    }
  };
}
