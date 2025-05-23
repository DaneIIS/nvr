import { useMemo } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { useCameras, useCamerasFailed } from "lib/api/cameras";
import * as types from "lib/types";

type Cameras = {
  [key: string]: boolean;
};
interface CameraState {
  cameras: Cameras;
  selectedCameras: string[];
  toggleCamera: (cameraIdentifier: string) => void;
  selectSingleCamera: (cameraIdentifier: string) => void;
  selectionOrder: string[];
}

export const useCameraStore = create<CameraState>()(
  persist(
    (set) => ({
      cameras: {},
      selectedCameras: [],
      toggleCamera: (cameraIdentifier) => {
        set((state) => {
          const newCameras = { ...state.cameras };
          newCameras[cameraIdentifier] = !newCameras[cameraIdentifier];
          let newSelectionOrder = [...state.selectionOrder];
          if (newCameras[cameraIdentifier]) {
            newSelectionOrder.push(cameraIdentifier);
          } else {
            newSelectionOrder = newSelectionOrder.filter(
              (id) => id !== cameraIdentifier,
            );
          }
          return {
            cameras: newCameras,
            selectedCameras: Object.entries(newCameras)
              .filter(([_key, value]) => value)
              .map(([key]) => key),
            selectionOrder: newSelectionOrder,
          };
        });
      },
      selectSingleCamera: (cameraIdentifier) => {
        set((state) => {
          const newCameras = { ...state.cameras };
          Object.keys(newCameras).forEach((key) => {
            newCameras[key] = key === cameraIdentifier;
          });
          return {
            cameras: newCameras,
            selectedCameras: [cameraIdentifier],
            selectionOrder: [cameraIdentifier],
          };
        });
      },
      selectionOrder: [],
    }),
    { name: "camera-store" },
  ),
);

export const useFilteredCameras = () => {
  const camerasQuery = useCameras({});
  const failedCamerasQuery = useCamerasFailed({});

  // Combine the two queries into one object
  const cameraData: types.CamerasOrFailedCameras = useMemo(() => {
    if (!camerasQuery.data && !failedCamerasQuery.data) {
      return {};
    }
    return {
      ...camerasQuery.data,
      ...failedCamerasQuery.data,
    };
  }, [camerasQuery.data, failedCamerasQuery.data]);

  const { selectedCameras } = useCameraStore();
  return useMemo(
    () =>
      Object.keys(cameraData)
        .filter((key) => selectedCameras.includes(key))
        .reduce((obj: types.CamerasOrFailedCameras, key) => {
          obj[key] = cameraData[key];
          return obj;
        }, {}),
    [cameraData, selectedCameras],
  );
};
