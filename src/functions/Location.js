import Swal from 'sweetalert2';
import { distanceApi, posterFunction } from '../Api';

export const getCurrentDistance = async (add1) => {
  try {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      return await handleManualLocation(add1); // 🧠 Added return here
    }

    console.log("Getting Location Permissions");

    const position = await getCurrentPosition(); // 💥 Now it's awaitable
    const add2 = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };

    console.log("User location:", add2);

    const formData = { add1, add2 };
    const res = await posterFunction(distanceApi.getDistance, formData);

    if (res.success) {
      console.log("Distance:", res.data);
      return res.data;
    } else {
      await Swal.fire({
        title: 'Failed',
        text: res?.data || "Distance calculation failed.",
        icon: 'error',
      });
    }
  } catch (e) {
    console.error("Error getting home distance:", e);
    alert("An unexpected error occurred while fetching your location.");
  }
};

// 🌍 Wrapper to make geolocation awaitable
const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      resolve,
      async (error) => {
        console.error("Error getting location:", error);
        if (error.code === 1) {
          await Swal.fire({
            title: 'Permission Denied',
            text: 'Please enter your location manually.',
            icon: 'warning',
          });
          const manual = await handleManualLocation();
          resolve({ coords: null, manual });
        } else {
          reject(error);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 10000,
      }
    );
  });
};

// 🧠 Fallback if user denies geolocation
const handleManualLocation = async (add1) => {
  const { value: address } = await Swal.fire({
    title: 'Enter your location',
    input: 'text',
    inputLabel: 'Could not access your location. Please enter your address manually:',
    inputPlaceholder: 'e.g. Mumbai, Maharashtra',
    confirmButtonText: 'Submit',
    showCancelButton: true,
  });

  if (address) {
    try {
      const formData = { add1, manualAddress: address };
      const res = await posterFunction(distanceApi.getDistance, formData);

      if (res.success) {
        console.log("Distance (manual address):", res.data);
        return res.data;
      } else {
        alert("Failed to calculate distance. Please try again.");
      }
    } catch (err) {
      console.error("Error with manual address:", err);
      alert("Something went wrong while using manual address.");
    }
  }
};

// ✅ Location permission check
const requestLocationPermission = () => {
  return new Promise((resolve) => {
    if (navigator.geolocation && navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "granted" || result.state === "prompt") {
          resolve(true);
        } else {
          Swal.fire({
            title: 'Permission Required',
            text: 'Please enable location permission in your browser settings.',
            icon: 'info',
          });
          resolve(false);
        }
      }).catch(() => {
        // Some iOS Safari doesn't support permissions.query
        resolve(true);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
      resolve(false);
    }
  });
};
