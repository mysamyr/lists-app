const initState = () => ({
	breadcrumbsStack: [],
	listItems: [],
});

let store = initState();
// breadcrumbsStack
export const getBreadcrumbs = () => {
	return store.breadcrumbsStack;
};
export const getParentData = () => {
	return store.breadcrumbsStack.at(-2);
};
export const getListData = () => {
	return store.breadcrumbsStack.at(-1);
};
export const pushBreadcrumbs = (data) => {
	store.breadcrumbsStack.push(data);
};
export const popBreadcrumbs = () => {
	store.breadcrumbsStack.pop();
};
// listItems
export const getListItems = () => {
	return store.listItems;
};
export const setListItems = (data) => {
	store.listItems = data;
};
// common
export const clearState = () => {
	store = initState();
};
