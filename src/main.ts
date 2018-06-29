import '@dojo/shim/browser';
import ProjectorMixin from '@dojo/widget-core/mixins/Projector';
import Store from '@dojo/stores/Store';
import Fritter from './Fritter';
import Registry from '@dojo/widget-core/Registry';
import { addPost } from './feed/FeedProcess';

const store = new Store();
const registry = new Registry();
registry.defineInjector('state', () => () => store);

const socket = new WebSocket('wss://fritter-server.now.sh');
socket.onmessage = ({ data }) => addPost(store)(data);

const Projector = ProjectorMixin(Fritter);
const projector = new Projector();
projector.setProperties({ registry });
projector.merge(document.getElementById('fritter') as HTMLElement);
