export type RootStackParamList = {
  HomePage: undefined;
  Profile: { isBuyMode: boolean };
  Login: undefined;
  Register: undefined;
  Toys: undefined;
  Books: undefined;
  Sports: undefined;
  Sell: {
    initialData?: {
      id: string;
      name: string;
      description?: string;
      price: string;
      location: string;
      image: string;
    };
  };
  RequestForm: undefined;
  Details: {
    item: {
      description: string;
      id: string;
      title: string;
      price: string;
      location: string;
      image: string | { uri: string };
      category: string;
      user: string;
      username: string;
    };
    isRequested?: boolean;
    isListed?: boolean;
    buttonText?: string;
  };
  Items: {
    item:{
      category: string;
        }
  },
  BookingDetails: {
    item: {
      id: string;
      name: string;
      price: string;
      location: string;
      category: string;
    };
  };
  ListItems: undefined;
  Notification: { isBuyMode: boolean };
  Chat: {
    item: {
      id: string;
      name: string;
      description?: string;
      price: string;
      location: string;
      image: { uri: string };
      category: string;
    };
    buyer: { id: string; name: string; };
    seller: { id: string; name: string; };
  };
  FilteredResultsPage: {
    filteredItems: any[];
  };
};
