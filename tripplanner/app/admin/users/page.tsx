"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

type User = {
  _id: string;
  email: string;
  role: string;
};

const ROLES = ["user", "admin", "content_manager", "super_admin"];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const res = await api.get("/admin/users");
    setUsers(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (id: string, role: string) => {
    await api.patch(`/admin/users/${id}/role?role=${role}`);
    fetchUsers();
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t">
                <td className="p-4">{u.email}</td>

                <td className="p-4">
                  <select
                    value={u.role}
                    onChange={(e) => updateRole(u._id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </td>

                <td className="p-4 text-sm text-gray-500">
                  Role management
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
