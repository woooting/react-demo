import CardStack from '@/components/CardStack'
function Todolist() {
  return (
    <div className=" flex flex-col items-center gap-4 pt-5 h-screen">
      <h1 className="text-6xl font-bold text-[rgb(207,88,88)]">todolist</h1>
      <CardStack></CardStack>
    </div>
  )
}
export default Todolist
