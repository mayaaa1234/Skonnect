interface ImageData {
  id: number;
  url: string;
}

interface Slideshow {
  id: number;
  caption: string;
  images: ImageData[];
}

const handleErrors = async (response: Response) => {
  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    const errorMessage = result.msg || `Something went wrong. ${result.status}`;

    console.error("Server error:", errorMessage);
    throw new Error(errorMessage);
  }
};

const fetchAllSlideShows = async (): Promise<Slideshow[] | Slideshow> => {
  try {
    const response = await fetch("api/v1/slides", {
      method: "GET",
      credentials: "include",
    });
    handleErrors(response);

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};

const fetchImage = async (id: number): Promise<Buffer | null> => {
  //
  try {
    const response = await fetch(`api/v1/slides/images/${id}`, {
      method: "GET",
      credentials: "include",
    });
    handleErrors(response);

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Fetch error:", error);
    // return Buffer.alloc(0);
    return null;
  }
};

export { fetchAllSlideShows, fetchImage };
