import { GuestInfo } from "@/store/guestCheckoutStore";
import { getNationalityName } from "./country-data";

/**
 * Wraps a standard order payload into the guest checkout format.
 * The backend expects personal info at the top level and order data nested in `oinfo`.
 */
export function buildGuestOrderPayload(guestInfo: GuestInfo, orderPayload: any): any {
  // Read the selected weight delivery option that was persisted by the shipping form.
  // This object is the raw item from the /delivery-by-weight/options-summary response.
  let selectedWeightOption: any = null;
  try {
    const stored = sessionStorage.getItem('selectedWeightOption');
    if (stored) selectedWeightOption = JSON.parse(stored);
  } catch { /* ignore */ }

  return {
    userType: "GUEST",
    channel: 'WEB',
    deviceId: orderPayload.deviceId || '',
    geolocation: orderPayload.geolocation || '',
    guestOnboardRequest: {
      firstname: guestInfo.firstname,
      lastname: guestInfo.lastname,
      mobileNo: guestInfo.mobileNo,
      email: guestInfo.email,
      // dateOfBirth: guestInfo.dateOfBirth || '',
      dateOfBirth: '01-01-2000',
      password: guestInfo.password,
      // nationality: getNationalityName(guestInfo.nationality),
      nationality: 'British',
      city: guestInfo.city,
      countryCode: guestInfo.countryCode,
      gender: guestInfo.gender || ''
    },
    oinfo: {
      ...orderPayload,
      deliveryAddress: {
        ...(orderPayload.deliveryAddress || {}),
        id: orderPayload?.deliveryOption === 'delivery' ? 0 : orderPayload?.deliveryAddress?.id
        // id: orderPayload?.delivery
      },
      customerName: `${guestInfo.firstname} ${guestInfo.lastname}`,
      username: guestInfo.email
    }
  };
}
