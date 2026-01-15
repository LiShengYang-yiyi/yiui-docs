# 0GC 的StringBuilder [ZString]

 
[https://github.com/Cysharp/ZString](https://github.com/Cysharp/ZString) 
 
 适用于 .NET Core 和 Unity 的 零 分配 字符串生成器。 
 • struct StringBuilder 以避免分配构建器本身 
 • 租用写入缓冲区 ThreadStatic 或 ArrayPool 
 • 所有追加方法都是泛型（ Append&lt;T&gt;(T value) ）并直接写入缓冲区而不是连接 value.ToString 
 • T1 ~ T16 AppendFormat( AppendFormat<T1,...,T16>(string format, T1 arg1, ..., T16 arg16) 避免结构参数装箱 
 • 另外 T1 ~ T16 Concat( Concat<T1,...,T16>(T1 arg1, ..., T16 arg16) ) 避免装箱和 value.ToString 分配 
 • 方便的 ZString.Format/Concat/Join 方法可以代替 String.Format/Concat/Join 
 • 可以直接构建 Utf16( Span&lt;char&gt; ) 和 Utf8( ) Span&lt;byte&gt; 
 • 可以使用内部缓冲区来避免分配最终字符串 
 • 与 Unity TextMeshPro 集成以避免字符串分配 
 
 
![Image](/images/R6zzw1gCzilX7VkSRFac9wftn2c_1_d10cb64f.png)
 
 使用第三方插件 ZString 
 ZString 是一个高性能的 C# 字符串构建库，设计用于减少内存分配和提高字符串操作的性能。它特别适合在需要频繁进行字符串拼接和格式化的情况下使用，如日志记录、生成复杂的输出等。ZString 的核心原理包括以下几个方面： 
 1. 减少内存分配 
 传统的 C# 字符串是 [不可变的](https://so.csdn.net/so/search?q=%E4%B8%8D%E5%8F%AF%E5%8F%98%E7%9A%84&spm=1001.2101.3001.7020) ，每次进行字符串拼接或修改时都会创建一个新的字符串对象，导致频繁的内存分配和垃圾回收。ZString 通过使用缓冲区（Buffer）来减少这些不必要的内存分配。 
 2. 缓冲区复用 
 ZString 使用内部缓冲区来存储字符串数据，并通过池化（Pooling）技术复用这些缓冲区，进一步减少内存分配和垃圾回收开销。 
 3. 高效的字符串拼接 
 ZString 使用一种类似 StringBuilder 的方式来进行字符串拼接，但性能更高。它直接在缓冲区中操作，而不是每次拼接都创建新的字符串对象。 
 4. 高性能格式化 
 ZString 提供高性能的字符串格式化功能，类似于 string.Format，但性能更好。它通过在缓冲区中直接进行格式化操作，避免了中间对象的创建。 
 
 使用示例 
 以下是一个使用 ZString 进行字符串拼接和格式化的示例： 
 
 代码块 
 
 using Cysharp.Text; 
 using System; 
 
 public class ZStringExample 
 { 
 public static void Main ( string [] args) 
 { 
 // 创建一个 ZString 的 Utf16ValueStringBuilder 实例 
 using ( var sb = ZString.CreateStringBuilder()) 
 { 
 sb.Append( "Hello" ); 
 sb.Append( ' ' ); 
 sb.Append( "World" ); 
 
 // 输出拼接后的字符串 
 Console.WriteLine(sb.ToString()); 
 } 
 
 // 使用 ZString 进行字符串格式化 
 string formattedString = ZString.Format( "My name is {0} and I am {1} years old." , "Alice" , 30 ); 
 Console.WriteLine(formattedString); 
 } 
 }