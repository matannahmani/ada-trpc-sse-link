import AuthRequiredPage from "@/components/auth/auth-required";

function ChatPage({ params }: { params: { id: string } }) {
  return (
    // @ts-expect-error async component not support by typescript yet
    <AuthRequiredPage>
      <div>
        <h1>Chat Page</h1>
        <p>Chat with {params.id}</p>
      </div>
    </AuthRequiredPage>
  );
}

export default ChatPage;
