import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import PortalManager from './PortalManager';

type Props = {
  children: React.ReactNode;
};

type Operation =
  | { type: 'mount'; key: number; children: React.ReactNode }
  | { type: 'update'; key: number; children: React.ReactNode }
  | { type: 'unmount'; key: number };

export type PortalMethods = {
  mount: (children: React.ReactNode) => number;
  update: (key: number, children: React.ReactNode) => void;
  unmount: (key: number) => void;
};

export const PortalContext = React.createContext<PortalMethods>(null as any);

/**
 * Portal host renders all of its children `Portal` elements.
 * For example, you can wrap a screen in `Portal.Host` to render items above the screen.
 * If you're using the `Provider` component, it already includes `Portal.Host`.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Text } from 'react-native';
 * import { Portal } from 'react-native-paper';
 *
 * export default class MyComponent extends React.Component {
 *   render() {
 *     return (
 *       <Portal.Host>
 *         <Text>Content of the app</Text>
 *       </Portal.Host>
 *     );
 *   }
 * }
 * ```
 *
 * Here any `Portal` elements under `<App />` are rendered alongside `<App />` and will appear above `<App />` like a `Modal`.
 */
export default class PortalHost extends React.Component<Props> {
  static displayName = 'Portal.Host';

  componentDidMount() {
    const manager = this._manager;
    const queue = this._queue;

    while (queue.length && manager) {
      const action = queue.pop();
      if (action) {
        // eslint-disable-next-line default-case
        switch (action.type) {
          case 'mount':
            manager.mount(action.key, action.children);
            break;
          case 'update':
            manager.update(action.key, action.children);
            break;
          case 'unmount':
            manager.unmount(action.key);
            break;
        }
      }
    }
  }

  _setManager = (manager: PortalManager | undefined | null) => {
    this._manager = manager;
  };

  _mount = (children: React.ReactNode) => {
    const key = this._nextKey++;

    if (this._manager) {
      this._manager.mount(key, children);
    } else {
      this._queue.push({ type: 'mount', key, children });
    }

    return key;
  };

  _update = (key: number, children: React.ReactNode) => {
    if (this._manager) {
      this._manager.update(key, children);
    } else {
      const op = { type: 'mount', key, children };
      const index = this._queue.findIndex(
        o => o.type === 'mount' || (o.type === 'update' && o.key === key)
      );

      if (index > -1) {
        // @ts-ignore
        this._queue[index] = op;
      } else {
        this._queue.push(op as Operation);
      }
    }
  };

  _unmount = (key: number) => {
    if (this._manager) {
      this._manager.unmount(key);
    } else {
      this._queue.push({ type: 'unmount', key });
    }
  };

  _nextKey = 0;
  _queue: Operation[] = [];
  _manager: PortalManager | null | undefined;

  render() {
    return (
      <PortalContext.Provider
        value={{
          mount: this._mount,
          update: this._update,
          unmount: this._unmount,
        }}
      >
        {/* Need collapsable=false here to clip the elevations, otherwise they appear above Portal components */}
        <View style={styles.container} collapsable={false}>
          {this.props.children}
        </View>
        <PortalManager ref={this._setManager} />
      </PortalContext.Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
