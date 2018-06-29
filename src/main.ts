import ProjectorMixin from '@dojo/widget-core/mixins/Projector';
import Fritter from './Fritter';

const Projector = ProjectorMixin(Fritter);
const projector = new Projector();
projector.append();
