import { Theme } from '@radix-ui/themes';
import { PropsWithChildren } from 'react';

const ThemeProvider = ({ children }: PropsWithChildren) => {
  return (
    <Theme>
      {children}
    </Theme>
  );
};

export default ThemeProvider;