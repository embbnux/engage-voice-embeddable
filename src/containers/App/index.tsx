import { getAlertRenderer } from '@ringcentral-integration/engage-voice-widgets/components/AlertRenderer';
import { EvLoginHeader } from '@ringcentral-integration/engage-voice-widgets/components/EvLoginHeader';
import { CallerIdLabel } from '@ringcentral-integration/engage-voice-widgets/components/ManualDialSettingsPanel/CallerIdLabel';
import { QueueLabel } from '@ringcentral-integration/engage-voice-widgets/components/ManualDialSettingsPanel/QueueLabel';
import { ActiveCallListPage } from '@ringcentral-integration/engage-voice-widgets/containers/ActiveCallListPage';
import { ActivityCallLogPage } from '@ringcentral-integration/engage-voice-widgets/containers/ActivityCallLogPage';
import { DialerPage } from '@ringcentral-integration/engage-voice-widgets/containers/DialerPage';
import { InboundQueuesPage } from '@ringcentral-integration/engage-voice-widgets/containers/InboundQueuesPage';
import { LoginPage } from '@ringcentral-integration/engage-voice-widgets/containers/LoginPage';
import { MainViewPage } from '@ringcentral-integration/engage-voice-widgets/containers/MainViewPage';
import { ManualDialSettingsPage } from '@ringcentral-integration/engage-voice-widgets/containers/ManualDialSettingsPage';
import { RequeueCallGroupItemPage } from '@ringcentral-integration/engage-voice-widgets/containers/RequeueCallGroupItemPage';
import { RequeueCallGroupPage } from '@ringcentral-integration/engage-voice-widgets/containers/RequeueCallGroupPage';
import { SessionConfigPage } from '@ringcentral-integration/engage-voice-widgets/containers/SessionConfigPage';
import { SettingsPage } from '@ringcentral-integration/engage-voice-widgets/containers/SettingsPage';
import { TransferCallPage } from '@ringcentral-integration/engage-voice-widgets/containers/TransferCallPage';
import { TransferInternalRecipientPage } from '@ringcentral-integration/engage-voice-widgets/containers/TransferInternalRecipientPage';
import { TransferPhoneBookRecipientPage } from '@ringcentral-integration/engage-voice-widgets/containers/TransferPhoneBookRecipientPage';
import { TransferManualEntryRecipientPage } from '@ringcentral-integration/engage-voice-widgets/containers/TransferManualEntryRecipientPage';
import { transferTypes } from '@ringcentral-integration/engage-voice-widgets/enums';
import { theme as defaultTheme } from '@ringcentral-integration/engage-voice-widgets/theme';
// import { RcCircularProgress } from '@ringcentral-integration/rcui';
import React, { FunctionComponent, useCallback } from 'react';
import { Provider } from 'react-redux';
import { Route, Router } from 'react-router';
import { BlockContainer } from 'ringcentral-widgets/containers/BlockContainer';
import { NotificationContainer } from 'ringcentral-widgets/containers/NotificationContainer';
import ConnectivityBadgeContainer from 'ringcentral-widgets/containers/ConnectivityBadgeContainer';
import { ModalContainer } from 'ringcentral-widgets/containers/ModalContainer';
import RegionSettingsPage from 'ringcentral-widgets/containers/RegionSettingsPage';
import { PhoneProviderProps } from 'ringcentral-widgets/lib/phoneContext';
import PhoneProvider from 'ringcentral-widgets/lib/PhoneProvider';

import { AppView } from '../AppView';

type AppProps = PhoneProviderProps;

const App: FunctionComponent<AppProps> = ({ phone, theme }) => {
  return (
    <PhoneProvider phone={phone} theme={theme}>
      <Provider store={phone.store}>
        <Router history={phone.routerInteraction.history}>
          <Route
            component={(routerProps) => (
              <AppView>
                {routerProps.children}
                <ConnectivityBadgeContainer />
                <ModalContainer />
                <NotificationContainer
                  getAdditionalRenderer={getAlertRenderer}
                />
                <BlockContainer />
              </AppView>
            )}
          >
            <Route
              path="/"
              component={() => (
                <LoginPage
                  onLoading={() => phone.block.block()}
                  onLoadingComplete={() => phone.block.unblockAll()}
                >
                  <EvLoginHeader />
                </LoginPage>
              )}
            />
            <Route
              path="/sessionConfig"
              component={() => <SessionConfigPage />}
            />
            <Route
              path="/sessionConfig/inboundQueues"
              component={() => <InboundQueuesPage />}
            />
            <Route
              path="/"
              component={(routerProps) => (
                <MainViewPage>{routerProps.children}</MainViewPage>
              )}
            >
              <Route path="/dialer" component={() => <DialerPage />} />
              <Route
                path="/manualDialSettings"
                component={() => (
                  <ManualDialSettingsPage
                    renderCallerIdLabel={CallerIdLabel}
                    renderQueueLabel={QueueLabel}
                  />
                )}
              />
              <Route
                path="/activityCallLog/:id"
                component={({ params: { id } }) => (
                  <ActivityCallLogPage id={id} />
                )}
              />
              <Route
                path="/activityCallLog/:id/transferCall"
                component={({ params: { id } }) => <TransferCallPage id={id} />}
              />
              <Route
                path="/activityCallLog/:id/transferCall/queueGroup"
                component={({ params: { id } }) => (
                  <RequeueCallGroupPage id={id} />
                )}
              />
              <Route
                path="/activityCallLog/:id/transferCall/queueGroup/:groupId"
                component={({ params: { id, groupId } }) => (
                  <RequeueCallGroupItemPage id={id} groupId={groupId} />
                )}
              />
              <Route
                path={`/activityCallLog/:id/transferCall/${transferTypes.internal}`}
                component={({ params: { id } }) => (
                  <TransferInternalRecipientPage id={id} />
                )}
              />
              <Route
                path={`/activityCallLog/:id/transferCall/${transferTypes.phoneBook}`}
                component={({ params: { id } }) => (
                  <TransferPhoneBookRecipientPage id={id} />
                )}
              />
              <Route
                path={`/activityCallLog/:id/transferCall/${transferTypes.manualEntry}`}
                component={({ params: { id } }) => (
                  <TransferManualEntryRecipientPage id={id} />
                )}
              />
              <Route
                path="/activityCallLog/:id/activeCallList"
                component={({ params: { id } }) => (
                  <ActiveCallListPage id={id} />
                )}
              />
              <Route
                path="/settings"
                component={(routerProps) => (
                  <SettingsPage
                    params={routerProps.location.query}
                    regionSettingsUrl="/settings/region"
                    showAudio={false}
                    showUserGuide={false}
                    showFeedback={false}
                  />
                )}
              />
              <Route path="/settings/region" component={RegionSettingsPage} />
            </Route>
          </Route>
        </Router>
      </Provider>
    </PhoneProvider>
  );
};

App.defaultProps = {
  theme: defaultTheme,
};

export { App };
