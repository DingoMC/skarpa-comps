import '@/app/globals.css';
import { ThemeProvider } from '@/lib/mui';
import { cardBodyTheme, cardFooterTheme, cardHeaderTheme, cardTheme, inputTheme } from '@/lib/themes';
import { StoreProvider } from '@/lib/wrappers/StoreProvider';
import TokenGateway from '@/lib/wrappers/TokenGateway';
import ComplexNavbar from '@/modules/navigation/components';
import { Sidebar, SidebarMobile } from '@/modules/navigation/components/Sidebar';
import SubNavbar from '@/modules/navigation/components/SubNavbar';
import CompetitionSelectorGateway from '@/modules/selectors/competition/gateway';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const customTheme = {
  card: cardTheme,
  cardHeader: cardHeaderTheme,
  cardFooter: cardFooterTheme,
  cardBody: cardBodyTheme,
  input: inputTheme,
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html className="m-0 p-0 min-h-screen" data-theme="light" lang="en">
    <body className="m-0 p-0">
      <StoreProvider>
        <TokenGateway>
          <div className="flex w-full h-full">
            <ThemeProvider value={customTheme}>
              <div className="flex flex-col h-full min-w-px min-h-px flex-1">
                <ComplexNavbar />
                <SubNavbar />
                <SidebarMobile />
                <div className="flex">
                  <Sidebar />
                  <div className="flex-1 max-w-full md:min-h-[calc(100vh-144px)] p-2 md:p-4">
                    <CompetitionSelectorGateway />
                    {children}
                  </div>
                </div>
                <ToastContainer position="bottom-right" />
              </div>
            </ThemeProvider>
          </div>
        </TokenGateway>
      </StoreProvider>
    </body>
  </html>
);

export default RootLayout;
