在Java中，synchronized关键字是用来控制线程同步的，就是在多线程的环境下，控制synchronized代码段不被多个线程同时执行。synchronized既可以加在一段代码上，也可以加在方法上。 			
关键是，不要认为给方法或者代码段加上synchronized就万事大吉，看下面一段代码：
```
public class Sync
{
    public synchronized void test()
    {
        System.out.println("----------test start----------");
        try
        {
            Thread.sleep(1000);
        }
        catch (InterruptedException e)
        {
            e.printStackTrace();
        }
        System.out.println("----------test end------------");
    }
}

public class Test
{
    public static void main(String[] args)
    {
        for (int i = 0; i < 3; i++)
        {
            Thread thread = new Thread()
            {
                public void run()
                {
                    Sync sync = new Sync();
                    sync.test();
                }
            };
            thread.start();
        }
    }
}
```
运行结果：  
----------test start----------  
----------test start----------  
----------test start----------  
----------test end------------  
----------test end------------  
----------test end------------  

</br>
可以看出来，上面的程序起了三个线程，同时运行Sync类中的test()方法，虽然test()方法加上了synchronized，但是还是同时运行起来，貌似synchronized没起作用。
将test()方法上的synchronized去掉，在方法内部加上synchronized(this)：
```
 public class Sync
{
    public void test()
    {
        synchronized (this)
        {
            System.out.println("----------test start----------");
            try
            {
                Thread.sleep(1000);
            }
            catch (InterruptedException e)
            {
                e.printStackTrace();
            }
            System.out.println("----------test end------------");
        }
    }
}
```
运行结果：  
----------test start----------  
----------test start----------  
----------test start----------  
----------test end------------  
----------test end------------  
----------test end------------  

一切还是那么平静，没有看到synchronized起到作用。

实际上，<font color=blue>synchronized(this)以及非static的synchronized方法</font>（至于static synchronized方法请往下看），只能防止多个线程同时执行<font color=blue>同一个对象</font>的同步代码段。

回到本文的题目上：synchronized锁住的是代码还是对象。答案是：<font color=red>synchronized锁住的是括号里的对象，而不是代码。对于非static的synchronized方法，锁住的就是对象本身也就是this。</font>

当synchronized锁住一个对象后，别的线程如果也想拿到这个对象的锁，就必须等待这个线程只想完成释放锁，才能再次给对象加锁，这样才能达到线程同步的目的。即使两个不同的代码段，都要锁同一个对象，那么这两个代码段也不能在多线程环境下同时运行。

所以我们在用synchronized关键字的时候，能缩小代码段的范围就尽量缩小，能在代码段上加同步就不要在整个方法上加同步。<font color=blue>这叫减小锁的粒度，使代码更大程序的并发</font>。原因是基于以上的思想，锁的代码太长了，别的线程需要等很久。

再看上面的代码，每个线程中都new了一个Sync类的对象，也就是产生了三个Sync对象，由于不是同一个对象，所以可以多线程同时运行synchronized方法或代码段。

为了验证上述的观点，修改一下代码，让三个线程使用同一个Sync的对象。
```
public class Test
{
    public static void main(String[] args)
    {
        Sync sync = new Sync();
        for (int i = 0; i < 3; i++)
        {
            Thread thread = new Thread()
            {
                public void run()
                {
                    sync.test();
                }
            };
            thread.start();
        }
    }
}
```
运行结果：  
----------test start----------  
----------test end------------  
----------test start----------  
----------test end------------  
----------test start----------  
----------test end------------  

可以看到，此时的synchronized就起了作用。

那么，如果真的想锁住这段代码，要怎么做？也就是，如果还是最开始的那段代码，每个线程new一个Sync对象，怎么才能让test方法不会被多线程执行。

解决也很简单，只要锁住同一个对象就行了。例如，synchronized后的括号中锁同一个固定对象，这样就行了。但是，比较多的做法是让synchronized锁这个类对应的Class对象。
```
public class Sync
{
    public void test()
    {
        synchronized (Sync.class)
        {
            System.out.println("----------test start----------");
            try
            {
                Thread.sleep(1000);
            }
            catch (InterruptedException e)
            {
                e.printStackTrace();
            }
            System.out.println("----------test end------------");
        }
    }
}
public class Test
{
    public static void main(String[] args)
    {
        for (int i = 0; i < 3; i++)
        {
            Thread thread = new Thread()
            {
                public void run()
                {
                    Sync sync = new Sync();
                    sync.test();
                }
            };
            thread.start();
        }
    }
}
```
运行结果：  
----------test start----------  
----------test end------------  
----------test start----------  
----------test end------------  
----------test start----------  
----------test end------------  

上面代码用<font color=red>synchronized(Sync.class)实现了全局锁的效果</font>。

static synchronized方法，static方法可以直接类名加方法名调用，方法中无法使用this，所以它锁的不是this，而是类的Class对象，所以，<font color=red>static synchronized方法也相当于全局锁，相当于锁住了代码段</font>。

总结：synchronized关键字简洁、清晰、语义明确，因此即使用了Lock接口，使用的还是非常广泛。其应用层的语义是可以把任何一个非null对象作为“锁”，<font color=red>当synchronized作用在方法上时，锁住的便是对象实例（this）；当作用在静态方法时锁住的便是对象对应的Class实例，因为Class数据存在于永久带，因此静态方法锁相当于该类的一个全局锁；当Synchronized作用于某一个对象实例时，锁住的便是相应的代码块</font>。
