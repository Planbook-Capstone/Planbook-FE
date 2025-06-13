"use client";
async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const AdminPage = async () => {
  await wait(1000);
  return <>Tổng quan</>;
};

export default AdminPage;
