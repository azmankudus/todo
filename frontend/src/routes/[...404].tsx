import { useNavigate } from "@solidjs/router";
import { onMount } from "solid-js";
import { errorStore } from "../stores/errorStore";

export default function NotFound() {
  const navigate = useNavigate();

  onMount(() => {
    errorStore.setError({
      code: "404",
      message: "The page you're looking for doesn't exist."
    });
    navigate("/", { replace: true });
  });

  return null;
}
