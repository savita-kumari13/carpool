import { NavigationActions } from 'react-navigation';
let _navigator;

function setTopLevelNavigator(navigatorRef) {
    _navigator = navigatorRef;
  }
  
function navigate(routeName, params) {
    _navigator.dispatch(
        NavigationActions.navigate({
        routeName,
        params,
        })
    );
}  

function back() {
    _navigator.dispatch(
        NavigationActions.back()
    );
} 

function popToTop(immediate = true) {
    _navigator.dispatch({
        type: NavigationActions.POP_TO_TOP,
        immediate
    });
} 

export default {
    navigate,
    setTopLevelNavigator,
    back,
    popToTop
  };

// window.NavigationService = NavigationService