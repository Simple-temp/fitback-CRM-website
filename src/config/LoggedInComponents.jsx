const loggedInUser = localStorage.getItem("loggedInUser");
const userParse = loggedInUser ? JSON.parse(loggedInUser) : null;
console.log("ID:", userParse?.id);

const useMenuOptions = () => {
[
  ...(userParse?.user_type === "Dietitian"
    ? [
        {
          title: "User Management",
          icon: "profile-circle",
          children: [
            {
              title: "Public",
              children: [
                { title: "Manage Public", path: "/admin/page" },
                { title: "Create Public", path: "/admin/create/page" },
              ],
            },
            {
              title: "Dietitian",
              children: [
                { title: "Manage Dietitian", path: "/dietitian/page" },
                { title: "Create Dietitian", path: "/dietitian/create/page" },
              ],
            },
            {
              title: "Desk",
              children: [
                { title: "Manage Desk", path: "/desk/page" },
                { title: "Create Desk", path: "/desk/create/page" },
              ],
            },
            {
              title: "Support",
              children: [
                { title: "Manage Support", path: "/support/page" },
                { title: "Create Support", path: "/support/create/page" },
              ],
            },
            {
              title: "HR",
              children: [
                { title: "Manage HR", path: "/hr/page" },
                { title: "Create HR", path: "/hr/create/page" },
              ],
            },
          ],
        },
        {
          title: "Products Management",
          icon: "profile-circle",
          children: [
            {
              title: "Products",
              children: [
                { title: "Manage Products", path: "/product/page" },
                { title: "Create Products", path: "/product/create/page" },
              ],
            },
          ],
        },
        {
          title: "Orders Management",
          icon: "profile-circle",
          children: [
            {
              title: "Orders",
              children: [
                { title: "Manage Orders", path: "/orders/page" },
              ],
            },
          ],
        },
      ]
    : []),


  // Admin User Management Options
  ...(userParse?.user_type === "Admin"
    ? [
        {
          title: "User Management",
          icon: "profile-circle",
          children: [
            {
              title: "Public",
              children: [
                { title: "Manage Public", path: "/admin/page" },
                { title: "Create Public", path: "/admin/create/page" },
              ],
            },
            {
              title: "Dietitian",
              children: [
                { title: "Manage Dietitian", path: "/dietitian/page" },
                { title: "Create Dietitian", path: "/dietitian/create/page" },
              ],
            },
            {
              title: "Desk",
              children: [
                { title: "Manage Desk", path: "/desk/page" },
                { title: "Create Desk", path: "/desk/create/page" },
              ],
            },
            {
              title: "Support",
              children: [
                { title: "Manage Support", path: "/support/page" },
                { title: "Create Support", path: "/support/create/page" },
              ],
            },
            {
              title: "HR",
              children: [
                { title: "Manage HR", path: "/hr/page" },
                { title: "Create HR", path: "/hr/create/page" },
              ],
            },
          ],
        },
        {
          title: "Products Management",
          icon: "profile-circle",
          children: [
            {
              title: "Products",
              children: [
                { title: "Manage Products", path: "/product/page" },
                { title: "Create Products", path: "/product/create/page" },
              ],
            },
          ],
        },
        {
          title: "Orders Management",
          icon: "profile-circle",
          children: [
            {
              title: "Orders",
              children: [
                { title: "Manage Orders", path: "/orders/page" },
              ],
            },
          ],
        },
      ]
    : []),

  // // Dietitian Management Options
  ...(userParse?.user_type === "Desk"
    ? [
        {
          title: "Bill Management",
          icon: "profile-circle",
          children: [
            {
              title: "Fitback",
              children: [
                { title: "Money Recept", path: "/moneyrecept/page" },
                { title: "Invoice", path: "/invoice/page" },
              ],
            },
            {
              title: "Reset",
              children: [
                { title: "Money Recept", path: "/reset/moneyrecept/page" },
                { title: "Invoice", path: "/reset/invoice/page" },
              ],
            },
            {
              title: "Asthetic",
              children: [
                { title: "Money Recept", path: "/asthetic/moneyrecept/page" },
                { title: "Invoice", path: "/asthetic/invoice/page" },
              ],
            },
          ],
        },
      ]
    : []),

  ...(userParse?.user_type === "Support"
      ? [
          {
            title: "User Management",
            icon: "profile-circle",
            children: [
              {
                title: "User Information",
                children: [
                  { title: "All Users", path: "/allusers/page" },
                ],
              },
            ],
          },
        ]
  : []),
  
]
};

export default useMenuOptions;
