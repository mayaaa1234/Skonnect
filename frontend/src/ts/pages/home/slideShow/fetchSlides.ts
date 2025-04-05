import ErrorHandler from "../../../utils/errorHandler.ts";

interface ImageData {
  id: number;
  url: string;
}

export interface Slideshow {
  id: number;
  caption: string;
  images: ImageData[];
}

interface APIErrorResponse {
  msg?: string;
  status?: number;
}

const fetchAllSlideShows = async (): Promise<Slideshow[]> => {
  try {
    const response = await fetch("api/v1/slides", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      await ErrorHandler.handleResponseError(response);
      return [];
    }

    const data = await response.json();
    // console.log({ data });
    return data;
  } catch (e) {
    // console.error(e);
    return [];
  }
};

const fetchImage = async (id: number): Promise<Buffer | null> => {
  try {
    const response = await fetch(`api/v1/slides/images/${id}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      await ErrorHandler.handleResponseError(response);
    }
    const data = await response.json();
    // console.log({ data });
    return data;
  } catch (e) {
    console.error(e);
    // return Buffer.alloc(0);
    return null;
  }
};

export { fetchAllSlideShows, fetchImage };
