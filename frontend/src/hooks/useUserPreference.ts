"use client";

import * as React from "react";
import type { UserPreference } from "@shared/recommendation";

export function useUserPreference(initial: UserPreference = "balanced") {
  const [preference, setPreference] = React.useState<UserPreference>(initial);

  return { preference, setPreference };
}
