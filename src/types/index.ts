export interface Criteria {
  size: string;
  date: string;
  time: string;
}

export interface RecommendedOption {
  id: string;
  method: string;
  text: string;
  time: string;
}

export interface Result {
  post: {
    slug: string;
    venue_name: string;
    score: number;
  };
  availability: {
    page: {
      title: string;
      subtitle: string;
    };
    formattedRequest: {
      date: string;
      time: string;
      size: string;
      service: string;
    };
    recommended: RecommendedOption[];
  };
}
