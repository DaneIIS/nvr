import dayjs, { Dayjs } from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ServerDown from "svg/undraw/server_down.svg?react";

import { ErrorMessage } from "components/error/ErrorMessage";
import { Layout } from "components/events/Layouts";
import { useCameraStore } from "components/events/utils";
import { Loading } from "components/loading/Loading";
import { useHideScrollbar } from "hooks/UseHideScrollbar";
import { useTitle } from "hooks/UseTitle";
import { useCameras, useCamerasFailed } from "lib/api/cameras";
import {
  insertURLParameter,
  objHasValues,
  objIsEmpty,
  removeURLParameter,
} from "lib/helpers";
import * as types from "lib/types";

const getDefaultTab = (searchParams: URLSearchParams) => {
  if (
    searchParams.has("tab") &&
    (searchParams.get("tab") === "events" ||
      searchParams.get("tab") === "timeline")
  ) {
    return searchParams.get("tab") as "events" | "timeline";
  }
  return "events";
};

const Events = () => {
  useTitle("Events");
  useHideScrollbar();
  const [searchParams] = useSearchParams();
  const camerasQuery = useCameras({});
  const failedCamerasQuery = useCamerasFailed({});
  const { selectSingleCamera } = useCameraStore();

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

  const [selectedEvent, setSelectedEvent] = useState<types.CameraEvent | null>(
    null,
  );
  const [date, setDate] = useState<Dayjs | null>(
    searchParams.has("date")
      ? dayjs(searchParams.get("date") as string)
      : dayjs(),
  );
  const [requestedTimestamp, setRequestedTimestamp] = useState<number | null>(
    dayjs().unix() - 10,
  );
  const [selectedTab, setSelectedTab] = useState<"events" | "timeline">(
    getDefaultTab(searchParams),
  );

  useEffect(() => {
    if (objHasValues(cameraData) && searchParams.has("camera")) {
      selectSingleCamera(
        cameraData[searchParams.get("camera") as string].identifier,
      );
      const newUrl = removeURLParameter(window.location.href, "camera");
      window.history.pushState({ path: newUrl }, "", newUrl);
    }
  }, [cameraData, searchParams, selectSingleCamera]);

  useEffect(() => {
    if (date) {
      insertURLParameter("date", date.format("YYYY-MM-DD"));
    }
  }, [date]);

  if (camerasQuery.isError) {
    return (
      <ErrorMessage
        text={`Error loading cameras`}
        subtext={camerasQuery.error.message}
        image={
          <ServerDown
            width={150}
            height={150}
            role="img"
            aria-label="Server down"
          />
        }
      />
    );
  }

  if (camerasQuery.isLoading || failedCamerasQuery.isLoading) {
    return <Loading text="Loading Camera" />;
  }

  if (objIsEmpty(cameraData)) {
    return null;
  }

  return (
    <Layout
      cameras={cameraData}
      selectedEvent={selectedEvent}
      setSelectedEvent={setSelectedEvent}
      date={date}
      setDate={setDate}
      requestedTimestamp={requestedTimestamp}
      setRequestedTimestamp={setRequestedTimestamp}
      selectedTab={selectedTab}
      setSelectedTab={setSelectedTab}
    />
  );
};

export default Events;
