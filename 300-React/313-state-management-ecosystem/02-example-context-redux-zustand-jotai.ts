type Listener = () => void;

function createMiniStore<T>(initialState: T) {
  let state = initialState;
  const listeners = new Set<Listener>();

  return {
    getState() {
      return state;
    },
    setState(nextState: T) {
      state = nextState;
      listeners.forEach((listener) => listener());
    },
    subscribe(listener: Listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

const cardStore = createMiniStore({
  cardNumber: '',
  cvc: '',
});

const unsubscribe = cardStore.subscribe(() => {
  console.log('store updated:', cardStore.getState());
});

cardStore.setState({
  cardNumber: '4234',
  cvc: '123',
});

unsubscribe();
