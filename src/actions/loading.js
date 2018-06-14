export function setLoading(loading) {
  return dispatch => dispatch({ type: 'APP_LOADING', loading });
}