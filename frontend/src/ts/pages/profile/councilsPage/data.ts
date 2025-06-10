export interface Council {
  id: string;
  url: string;
  image: Buffer;
}

const uploadCouncilImgs = async (imgs: Buffer[]): Promise<void> => {
  const response = await fetch("/api/v1/councils", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(imgs),
  });

  if (!response.ok)
    throw new Error(`Error uploading council images: ${response.status}`);
};

const fetchAllImageURLs = async (): Promise<Omit<Council, "image">[]> => {
  const response = await fetch("/api/v1/councils", {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok)
    throw new Error(`Error fetching council images: ${response.status}`);

  const data: Omit<Council, "image">[] = await response.json();
  return data;
};

export { fetchAllImageURLs, uploadCouncilImgs };
