import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/lara-dark-blue/theme.css";
import { PrimeReactContext } from "primereact/api";

import { Button } from "primereact/button";
import { useContext, useEffect } from "react";
const value = {
  ripple: true,
};
function App() {
  return (
    <PrimeReactProvider value={value}>
      <div>
        <SubComponent />
      </div>
    </PrimeReactProvider>
  );
}

const SubComponent = () => {
  const { setRipple } = useContext(PrimeReactContext);

  useEffect(() => {
    if (setRipple) {
      setRipple(true);
    }
  }, [setRipple]);

  return <Button label="Click" />;
};

export default App;
