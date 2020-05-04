import VFBMain from '../components/VFBMain';
import { vfbLoadId, vfbIdLoaded, vfbUIUpdated } from '../actions/generals';
import { connect } from "react-redux";

const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch => ({
  vfbLoadId: id => dispatch(vfbLoadId(id)),
  vfbIdLoaded: (id, component) => dispatch(vfbIdLoaded(id, component)),
  vfbUIUpdated: layout => dispatch(vfbUIUpdated(layout))
});

export default connect(mapStateToProps, mapDispatchToProps)(VFBMain);
