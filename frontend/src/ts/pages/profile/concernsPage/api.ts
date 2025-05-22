export interface Concern {
  id: number;
  message: string;
  concern_owner_username: string;
  concern_owner_email: string;
  status: "default" | "rejected" | "acknowledged" | "in_progress" | "resolved";
  response: string;
}

const filterConcerns = (
  concerns: Concern[],
  status: Concern["status"],
): Concern[] => {
  return concerns.filter((c) => c.status === status);
};

async function fetchAllConcerns(): Promise<Concern[]> {
  const res = await fetch("/api/v1/concerns", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return await res.json();
}

async function deleteConcern(id: number): Promise<void> {
  const res = await fetch(`/api/v1/concerns/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
}

async function submitConcern(message: string): Promise<void> {
  const res = await fetch("/api/v1/concerns", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
}

async function updateConcernStatusToDB(
  id: number,
  newStatus: string,
): Promise<void> {
  const res = await fetch(`/api/v1/concerns/status/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ newStatus }),
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  console.log({ id, newStatus });
  console.log("concern status update successful");
}

export {
  filterConcerns,
  updateConcernStatusToDB,
  submitConcern,
  fetchAllConcerns,
  deleteConcern
};
