import { Button } from "@/components/ui/button";

const DashboardLayout = ({ children }) => {
  return (
    <div>
      DashboardLayout
      <Button>Click me</Button>
      <div>{children}</div>
    </div>
  );
};

export default DashboardLayout;
