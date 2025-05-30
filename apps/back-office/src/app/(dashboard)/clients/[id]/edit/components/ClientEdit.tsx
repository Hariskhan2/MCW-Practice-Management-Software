"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@mcw/ui";
import { ClientDetailsCard } from "./ClientDetailsCard";
import { useQuery } from "@tanstack/react-query";
import { fetchClientGroups } from "@/(dashboard)/clients/services/client.service";
import Link from "next/link";
import { getClientGroupInfo } from "@/(dashboard)/clients/[id]/components/ClientProfile";
import { GroupInfo } from "./tabs/GroupInfo";
import { useSearchParams, useRouter } from "next/navigation";
import Loading from "@/components/Loading";
// Matching the structure in ClientDetailsCard
export interface ClientMembership {
  client_id: string;
  client_group_id: string;
  created_at: Date;
  type: string;
  role: string | null;
  is_contact_only: boolean;
  is_responsible_for_billing: boolean | null;
  Client: {
    id: string;
    legal_first_name: string;
    legal_last_name: string;
    is_active: boolean;
    address?: string | null;
    receive_reminders?: boolean;
    has_portal_access?: boolean;
    last_login_at?: Date | null;
    is_responsible_for_billing?: boolean;
    preferred_name?: string | null;
    date_of_birth?: Date | null;
    middle_name?: string | null;
    suffix?: string | null;
    ClientContact: Array<{
      id: string;
      value: string;
      contact_type: string;
      type?: string;
      permission?: string;
      is_primary?: boolean;
    }>;
    ClientProfile?: {
      id: string;
      client_id: string;
      middle_name?: string | null;
      gender?: string | null;
      gender_identity?: string | null;
      relationship_status?: string | null;
      employment_status?: string | null;
      race_ethnicity?: string | null;
      race_ethnicity_details?: string | null;
      preferred_language?: string | null;
      notes?: string | null;
    };
    ClientAdress?: Array<{
      id: string;
      client_id: string;
      address_line1: string;
      address_line2: string;
      city: string;
      state: string;
      zip_code: string;
      country: string;
      is_primary: boolean;
    }>;
  };
}

// Client Group API response interface
export interface ClientGroupFromAPI {
  id: string;
  name: string;
  type: string;
  status?: string;
  notes?: string;
  is_active?: boolean;
  first_seen_at?: string;
  referred_by?: string;
  ClientGroupMembership: ClientMembership[];
}

export default function ClientEdit({
  clientGroupId,
}: {
  clientGroupId: string;
}) {
  const [activeTab, setActiveTab] = useState("group-info");
  const searchParams = useSearchParams();
  const router = useRouter();

  // Set the active tab based on URL parameter
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["group-info", "clients", "billing"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);

    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);

    router.push(`${window.location.pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  // Fetch client group data
  const { data: clientGroupData = {}, isLoading } = useQuery({
    queryKey: ["clientGroup", clientGroupId],
    queryFn: async () => {
      const [data, error] = await fetchClientGroups({
        searchParams: {
          id: clientGroupId,
          includeProfile: "true",
          includeAdress: "true",
        },
      });

      if (error) {
        throw error;
      }

      return data;
    },
  });

  // Check if clientGroupData is of type ClientGroupWithMembership
  const isClientGroup =
    clientGroupData &&
    typeof clientGroupData === "object" &&
    "ClientGroupMembership" in clientGroupData;

  // Extract client group data safely
  const clientData = isClientGroup
    ? (clientGroupData as unknown as ClientGroupFromAPI)
    : null;

  const clientType = {
    adult: "Client",
    minor: "Minor",
    couple: "Couple",
    family: "Family",
  };

  if (isLoading) {
    return <Loading className="items-center" />;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <nav className="flex items-center text-sm text-gray-500 mb-2">
          <Link href="/clients">Clients and contacts</Link>
          <span className="mx-2">/</span>
          <Link href={`/clients/${clientGroupId}`}>{clientData?.name}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">Edit client</span>
        </nav>
        <h1 className="text-2xl font-semibold mb-4">
          Edit client{" "}
          <span className="text-[#2D8467]">
            {clientData ? getClientGroupInfo(clientData) : ""}
          </span>
        </h1>
      </div>

      <Tabs
        defaultValue="clients"
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <div className="border-b border-[#e5e7eb] overflow-x-auto">
          <TabsList className="h-[40px] bg-transparent p-0 w-auto">
            <TabsTrigger
              className={`rounded-none h-[40px] px-3 sm:px-4 text-sm data-[state=active]:shadow-none data-[state=active]:bg-transparent ${activeTab === "group-info" ? "data-[state=active]:border-b-2 data-[state=active]:border-[#2d8467] text-[#2d8467]" : "text-gray-500"}`}
              value="group-info"
            >
              {clientType[clientData?.type as keyof typeof clientType]} Info
            </TabsTrigger>

            <TabsTrigger
              className={`rounded-none h-[40px] px-3 sm:px-4 text-sm data-[state=active]:shadow-none data-[state=active]:bg-transparent ${activeTab === "clients" ? "data-[state=active]:border-b-2 data-[state=active]:border-[#2d8467] text-[#2d8467]" : "text-gray-500"}`}
              value="clients"
            >
              Clients
            </TabsTrigger>
            <TabsTrigger
              className={`rounded-none h-[40px] px-3 sm:px-4 text-sm data-[state=active]:shadow-none data-[state=active]:bg-transparent ${activeTab === "billing" ? "data-[state=active]:border-b-2 data-[state=active]:border-[#2d8467] text-[#2d8467]" : "text-gray-500"}`}
              value="billing"
            >
              Billing and Insurance
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="group-info">
          <div className="mt-6">
            {clientData && <GroupInfo clientGroup={clientData} />}
          </div>
        </TabsContent>

        <TabsContent value="clients">
          <div className="mt-6">
            {clientData?.ClientGroupMembership.map((membership) => (
              <ClientDetailsCard
                key={membership.client_id}
                client={membership}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="billing">
          <div className="mt-6">
            <h2 className="text-lg font-semibold">Billing and Insurance</h2>
            {/* Billing tab content would go here */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
