export interface Review {
    _id: string;
    client_id: {
      _id: string;
      username: string;
      email: string;
    };
    lawyer_id: {
      _id: string;
      user: {
        _id: string;
        username: string;
        email: string;
      };
    };
    rating: number;
    comment: string;
    created_at: string;
    updated_at: string;
  }
  