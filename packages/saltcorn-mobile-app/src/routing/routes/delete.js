/*global saltcorn */
import { apiCall } from "../../helpers/api";
import { setHasOfflineData, hasOfflineRows } from "../../helpers/offline_mode";
import i18next from "i18next";

// post/delete/:name/:id
export const deleteRows = async (context) => {
  const { name, id } = context.params;
  const table = await saltcorn.data.models.Table.findOne({ name });
  const { isOfflineMode, localTableIds, user } =
    saltcorn.data.state.getState().mobileConfig;
  if (isOfflineMode || localTableIds.indexOf(table.id) >= 0) {
    if (user.role_id <= table.min_role_write) {
      await table.deleteRows({ id });
      // TODO 'table.is_owner' check?
    } else
      throw new saltcorn.data.utils.NotAuthorized(i18next.t("Not authorized"));
    if (isOfflineMode && (await hasOfflineRows()))
      await setHasOfflineData(true);
    // if (isOfflineMode && !(await offlineHelper.hasOfflineRows())) {
    //   await offlineHelper.setOfflineSession(null);
    // }
  } else {
    await apiCall({ method: "POST", path: `/delete/${name}/${id}` });
  }
  const redirect = context.data?.after_delete_url
    ? context.data.after_delete_url === "/"
      ? "/"
      : `get${new URL(context.data?.after_delete_url).pathname}`
    : new URLSearchParams(context.query).get("redirect");
  return { redirect };
};
