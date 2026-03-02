import { useNavigate } from "@solidjs/router";
import { onMount } from "solid-js";
import { errorStore } from "../shared/stores/errorStore";
import { RESOURCES } from "../config/resources";

export default function NotFound() {
  const navigate = useNavigate();

  onMount(() => {
    errorStore.setError({
      code: "404",
      message: RESOURCES.ERROR_PAGE.NOT_FOUND
    });
    navigate("/", { replace: true });
  });

  return null;
}
